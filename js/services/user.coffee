window.app.service 'User', ($rootScope, $q, $route, $firebase, $firebaseAuth, firebaseUrl, Firebase, Sidebar, mandrill, dazzleUrl, Counterparty) ->
	ref = new Firebase(firebaseUrl)
	authClient = $firebaseAuth ref

	user =
		# Check if user is logged in
		isLoggedIn: -> authClient.$getAuth()?

		# User information (name, email etc) object
		info:
			id: null
			firstName: null
			lastName: null
			email: null
			wallet: null
			facebook: null
			newPasswordRequired: null
			votingWallet: null
			temporaryPassword: null
			role: null # Available roles: ['admin', 'voting-admin']
			avatar: null
			votings: null
			project: null
			dco: null
			loaded: false
			allowMultiOptionsVote: false

		allUsers: null

		# Method to log user in
		login: (email, password, remember) ->
			Firebase.goOnline()
			encodedPassword = this.encodePassword password
			defer = $q.defer()
			authClient.$authWithPassword({
				email: email
				password: encodedPassword
			}, {remember: remember})
			.then ->
				updateInfo().then ->
					defer.resolve()
			.then null, (reason) ->
				if reason.code == 'INVALID_PASSWORD'
					authClient.$authWithPassword({
						email: email
						password: password
					}, {remember: remember})
					.then ->
						updateInfo({newPasswordRequired: true}).then ->
							defer.resolve()
					.then null, (reason)->
						defer.reject(reason)
				else
					defer.reject(reason)
			return defer.promise

		# Method to log user in with Facebook account
		facebookLogin: () ->
			self = this
			defer = $q.defer()
			authClient.$authWithOAuthPopup 'facebook', scope: 'email'
			.then (authData)->
				userData =
					first_name: authData.facebook.cachedUserProfile.first_name
					last_name: authData.facebook.cachedUserProfile.last_name
					email: authData.facebook.cachedUserProfile.email
					facebook: true
				self.update userData
				.then ->
					defer.resolve()
			return defer.promise


		# Method to log user out
		logout: ->
			authClient.$unauth()
			angular.extend user.info,
				firstName: null
				lastName: null
				email: null
				wallet: null
				facebook: null
				newPasswordRequired: null
				role: null
				avatar: null
				votingWallet: null
				temporaryPassword: null
				votings: null
				project: null
				dco: null
				loaded: null
				allowMultiOptionsVote: false
			Sidebar.hide()
			Sidebar.switchSection('User')
			location.reload()

		generatePassphrase: (length = 12) ->
			switch length
				when 3 then complexity = 32
				when 6 then complexity = 64
				when 9 then complexity = 92
				when 12 then complexity = 128
				else complexity = 128
			return new Mnemonic complexity
			.toWords().join(' ')

		getAsset: (assetName) ->
			self = this
			defer = $q.defer()
			assetQuantity = 0

			new Counterparty(self.info.privateKey).getAssets()
			.then (data) ->
				if data.length == 0
					defer.resolve assetQuantity
				else
					for asssetObj in data
						if asssetObj.asset == assetName
							assetQuantity = asssetObj.quantity
				defer.resolve assetQuantity
			.then null, (reason)->
				defer.resolve 0

			return defer.promise

		getUserDataByEmail: (email)->
#			self = this
			defer = $q.defer()
#			console.log 'sss'
			this.allUsers.forEach (user, id)->
				if user.email == email
					return defer.resolve {uid: id, userData: user}
			return defer.promise
#			self.getUidByEmail email
#			.then (uid)->
#				console.log 'aaaa'
#				defer.resolve {uid: uid, userData: self.allUsers[uid]}

		getAllUsers: ()->
			self = this
			defer = $q.defer()
			ref = new Firebase(firebaseUrl).child 'users'
			$firebase(ref).$asObject().$loaded()
			.then (data) ->
				self.allUsers = data
				defer.resolve()
			return defer.promise

		getUidByEmail: (email)->
			defer = $q.defer()
			this.allUsers.forEach (user, id)->
				if user.email == email
					return defer.resolve(id)
			return defer.promise

		emailNotification: (credentials, template = 'votingwalletinvite', options) ->
			defer = $q.defer()
			params =
				template_name: template
				template_content: [{
					name   : 'registrationLink'
					content: '<a href="' + dazzleUrl + '/login" target="_blank">here</a>'
				},{
					name   : 'signupLink'
					content: '<a href="' + dazzleUrl + '/login" target="_blank">here</a>'
				},{
					name   : 'loginLink'
					content: 'Click <a href="' + dazzleUrl + '/login" target="_blank">here</a> to login and vote.'
				}, {
					name   : 'password',
					content: credentials.password
				}, {
					name   : 'email',
					content: credentials.login
				}]
				message:
					to: [{
						email: credentials.login,
						name: credentials.userName || ''
					}]

			mandrill.sendTemplate params, defer.resolve, defer.reject

		# Encode password
		encodePassword: (password) ->
			bitcore = require 'bitcore'
			bitcoreBuffer = bitcore.util.buffer
			newBuffer = new bitcoreBuffer.EMPTY_BUFFER.constructor password
			key = bitcore.crypto.Hash.sha256 newBuffer
			return bitcoreBuffer.bufferToHex key

		# Method to create new user
		create: (login, password, data) ->
			self = this
			defer = $q.defer()
			passphrase = password
			password = this.encodePassword password
			authClient.$createUser(login, password)
			.then (userData) ->
				userData.email = login
				userData.passphrase = passphrase
				defer.resolve userData
				if data
					self.update data, userData.uid
			.then null, (reason) ->
				reason.userData = {
					email: login
				}
				defer.reject reason
			return defer.promise


		# Method to update user data
		update: (data, userId) ->
			defer = $q.defer()
			uid = userId || authClient.$getAuth().uid
			ref = new Firebase(firebaseUrl + '/users/' + uid)
			$firebase(ref).$update data
			.then ->
				updateInfo()
				defer.resolve()
			.then null, (reason) ->
				defer.reject reason
			return defer.promise

		updatePassword: (oldPassword, newPassword) ->
			self = this
			defer = $q.defer()
			newPasswordEncoded = this.encodePassword newPassword
			oldPasswordEncoded = this.encodePassword oldPassword
			authClient.$changePassword self.info.email, oldPassword, newPasswordEncoded
			.then ->
				if self.info.temporaryPassword
					self.update temporaryPassword: newPasswordEncoded
				self.update newPasswordRequired: null
				.then ->
					defer.resolve()
			.then null, ->
				authClient.$changePassword self.info.email, oldPasswordEncoded, newPasswordEncoded
				.then ->
					if self.info.temporaryPassword
						self.update temporaryPassword: newPasswordEncoded
					self.update newPasswordRequired: null
					.then ->
						defer.resolve()
				.then null, (reason) ->
					defer.reject reason
			return defer.promise


		resetPassword: (email) ->
			authClient.$resetPassword email

		# Method to remove user
		remove: (email, password, uid) ->
			self = this
			authClient.$getAuth()
			.then (result) ->
				if result.uid == uid
					self.logout()
				sync = $firebase ref.child 'users/'
				sync.$remove result.uid
				.then null, (reason) ->
					console.error 'User.remove.sync.$remove', reason
			authClient.$removeUser(email, password)
			.then null, (reason) ->
				console.error 'User.remove', reason

	# Method to update user info. Used in login, signin adn signout methods
	do updateInfo = (updatedData = {})->
		defer = $q.defer()
		auth = authClient.$getAuth()
		if auth
			userInfo =
				id: auth.uid
				email: auth.password?.email
				loaded: false
			angular.extend user.info, userInfo
			ref = new Firebase(firebaseUrl + '/users/' + auth.uid)
			$firebase(ref).$asObject().$loaded()
			.then (results) ->
				userInfo =
					firstName: results.first_name
					lastName: results.last_name
					email: if !userInfo.email then results.email else userInfo.email
					wallet: results.wallet
					facebook: userInfo.id.indexOf('facebook:') > -1
					newPasswordRequired: results.newPasswordRequired || updatedData?.newPasswordRequired
					role: results.role
					avatar: results.avatar
					votingWallet: results.votingWallet
					temporaryPassword: results.temporaryPassword
					votings: results.votings
					allowMultiOptionsVote: results.allowMultiOptionsVote
					project: results.project
					dco: results.dco
					loaded: true
				angular.extend user.info, userInfo
				if results.votingWallet
					Sidebar.show()
				defer.resolve()
		return defer.promise

	return user