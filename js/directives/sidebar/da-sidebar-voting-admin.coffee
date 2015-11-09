window.app.directive 'daSidebarVotingAdmin', ($q, $sce, $timeout, Voting, User, Wallet, Counterparty) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/sidebar-voting-admin.html'
	replace: true
	link: (scope) ->

		scope.voting = ''
		scope.newVoting = null || window.daDebug?.createNewVotingMode
		scope.loading = false
		scope.votingOptions = [{name: 'option1', value: ''}, {name: 'option2', value: ''}]

		scope.today = new Date()

		scope.votingOptionsView = true
		scope.votingInviteesView = false

		scope.expectingPayment = false
		scope.paymentReceived = false
		scope.votingCreated = false

		scope.$watch (-> User.info), (newValue) ->
			scope.userInfo = User.info if newValue.loaded

		scope.parseEmails = (emails) ->
			list = emails?.split('\n') || ''
			emailPattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
			recipientsTmpArr = []
			# let's check if any line has mails delimited by comma
			for str, i in list
				do (i, str) ->
					arr = str.split ','
					if arr.length > 1
						recipientsTmpArr = recipientsTmpArr.concat arr.filter (val) -> emailPattern.test val.trim()
					else
						recipientsTmpArr.push str.trim() if emailPattern.test str.trim()

			recipients = []
			for recipient in recipientsTmpArr
				recipient = recipient.trim()
				if recipients.indexOf(recipient) < 0
					recipients.push recipient

			scope.inviteesCount = recipients.length
			return recipients

		toCamelCase = (string) ->
			date = new Date
			timestamp = Date.parse(date)/1000
			string = string.replace(/[^a-zA-Z ]/g, '')
			string = string.replace(RegExp(' ', 'g'), '_')
			string = string+timestamp

		checkInvitees = ->
			defer = $q.defer()
			invitees = scope.parseEmails(scope.form.addVoting.votingInvitees.$viewValue)
			scope.voting.votingInvitees = invitees.join()
			if invitees.length < 2
				scope.form.addVoting.votingInvitees.$setValidity 'incorrect', false
				scope.form.addVoting.votingInvitees.customError = true
				scope.form.addVoting.votingInvitees.errorMessage = 'At least two invitees required.'
				scope.formSubmitted = false
				defer.reject()
			else if  invitees.length > 25
				scope.form.addVoting.votingInvitees.$setValidity 'incorrect', false
				scope.form.addVoting.votingInvitees.customError = true
				scope.form.addVoting.votingInvitees.errorMessage = 'The public version of Swarm vote only allows for 25 invitees on a vote. Contact <a href="mailto:support@swarm.fund">support@swarm.fund</a> if you require more than this.'
				scope.formSubmitted = false
				defer.reject()
			else
				defer.resolve invitees
			return defer.promise

		createInvitees = (votingId) ->
			scope.tmpInviteesObj = {}
			scope.tmpInvitees = []
			defer = $q.defer()
			scope.tmpInviteesCount = 0
			User.getAllUsers().then ()->
				checkInvitees().then (invitees)->
					scope.tmpInvitees = invitees
					angular.forEach invitees, (invitee) ->
						email = invitee.trim().toLowerCase()
						passphrase = User.generatePassphrase(6)
						encodedPassphrase = User.encodePassword passphrase
						userData = {
							votingWallet: true
							email: email
							temporaryPassword: encodedPassphrase
						}
						User.create email, passphrase, userData
						.then (userData) ->
							uid = userData.uid
							scope.tmpInviteesObj[uid] = {
								email: userData.email
								signed: false
								voted: false
							}
							User.emailNotification {login: userData.email, password: userData.passphrase}, 'votingwalletinvite'
							scope.tmpInviteesCount = scope.tmpInviteesCount+1
							Voting.inviteUser uid, votingId
						.then null, (reason) ->
							if reason.code == 'EMAIL_TAKEN'
								email = reason.userData.email.toLowerCase()
								User.emailNotification {login: email, voting: votingId}, 'invite-existing-user-to-vote'
								User.allUsers.forEach (data, id)->
									if data.email == email
										if !data.wallet
											userData = {votingWallet: true}
											User.update userData, id
										else
											Voting.signUser id, votingId
										scope.tmpInviteesObj[id] = {
											email: data.email
											signed: true
											voted: false
										}
										scope.tmpInviteesCount = scope.tmpInviteesCount+1
										Voting.inviteUser id, votingId
										return false
				scope.$watch (-> scope.tmpInviteesCount), (newValue)->
					if newValue == scope.tmpInvitees.length
						defer.resolve scope.tmpInviteesObj
			return defer.promise

		Voting.getVotings(true)
		.then (votings) ->
			scope.votings = votings
			scope.loading = false
		.then null, ()->
			scope.votings = null
			scope.loading = false

		scope.switchOptionsAndUsersView = ->
			scope.votingOptionsView = !scope.votingOptionsView
			scope.votingInviteesView = !scope.votingInviteesView

		scope.selectVoting = (voting) ->
			inviteesLength = 0
			for id, invitee of voting.invitees
				inviteesLength++ if invitee

			asset = voting.asset
			votingOptions = voting.options
			for option of votingOptions
				Voting.getVotesCount option, asset, true
				.then (data) ->
					if data.balance
						percent = data.balance / inviteesLength * 100
						votingOptions[data.address].votesCount = Math.round(percent*100)/100
					else
						votingOptions[data.address].votesCount = 0

			scope.title = voting.title
			scope.voting = voting

		scope.backToVotes = ->
			scope.voting = null
			scope.title = null

		scope.addNewVoting = ->
			scope.newVoting = true

		scope.cancelAddingVoting = ->
			scope.newVoting = false

		scope.createVoting = ->
			form = scope.form.addVoting
			scope.formSubmitted = true

			options = ->
				optionsObj = {}
				for index, option of scope.votingOptions
					optionWallet = Wallet.new().public
					optionsObj[optionWallet] = {
						address: optionWallet
						bio: option.value
					}
				return optionsObj
			if form.$valid
				votingId = toCamelCase form.votingName.$viewValue
				scope.votingWallet = Wallet.new()
				checkInvitees().then (invitees)->
					votingData = {
						paid: false
						description: form.votingDescription.$viewValue
						multiple: form.votingMultiple?.$viewValue || 1
						end_date: moment.utc(form.votingEndDate.$viewValue).format()
						id: votingId
						invitees: invitees
						options: options()
						owner: User.info.id
						start_date: moment.utc(form.votingStartDate.$viewValue).format()
						title: form.votingName.$viewValue
						wallet: scope.votingWallet
					}

					assetAmount = invitees.length
					Voting.create votingData
					.then () ->
						Voting.inviteUser User.info.id, votingId
						scope.expectingPayment = true
						multipleFee = form.votingMultiple?.$viewValue || 1
						scope.payForUsers = ((scope.inviteesCount*300000)*multipleFee)+100000
						scope.paymentValue = scope.payForUsers + 100000
						Voting.getPayment(scope.votingWallet.public, scope.paymentValue)
						.then ()->
							scope.paymentReceived = true
							scope.expectingPayment = false
							scope.loading = true
							counterparty = new Counterparty(scope.votingWallet.private)
							assetName = counterparty.generateFreeAssetName()
							counterparty.issueAsset(assetAmount*multipleFee, assetName)
							.then ()->
								createInvitees(votingId)
								.then (invitees)->
									Voting.create {
										paid: true
										id: votingId
										asset: assetName
										invitees: invitees
									}
									.then ()->
										Voting.getVotings()
										.then (votings) ->
											scope.votings = votings
											scope.voting = null
											scope.loading = false
											scope.newVoting = false
											scope.formSubmitted = false

		scope.removeOption = (optionIndex) ->
			if optionIndex > 1
				votingOptions = scope.votingOptions
				votingOptions.splice(optionIndex, 1)
				scope.votingOptions = votingOptions

		scope.addOption = ->
			votingOptions = scope.votingOptions
			votingOptions.push {name: 'option'+(votingOptions.length+1), value: ''}
			scope.votingOptions = votingOptions

		scope.hasError = (field) ->
			form = scope.form.addVoting
			if (field?.$touched && field?.$invalid) || ( scope.formSubmitted && field?.$invalid)
				if !field?.customError
					form.votingName?.errorMessage = if form.votingName.$invalid then 'Title is required.' else null
					form.votingDescription?.errorMessage = if form.votingDescription.$invalid then 'Description is required.' else null
					form.votingInvitees?.errorMessage = if form.votingInvitees.$invalid then 'Invitees are required.' else null
					form.votingStartDate?.errorMessage = if form.votingStartDate.$invalid then 'Start date is required.' else null
					form.votingEndDate?.errorMessage = if form.votingEndDate.$invalid then 'End date is required.' else null
					if field.$name.indexOf('option') > -1
						field.errorMessage = if field.$invalid then 'Option is required.' else null
				return true

		scope.resetInvitesValidity = ->
			scope.form.addVoting.votingInvitees.$setValidity 'incorrect', true
			scope.form.addVoting.votingInvitees.customError = false