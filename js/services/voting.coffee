window.app.service 'Voting', ($q, $firebase, $interval, firebaseUrl, RestBlockscan, RestChain, chainAPIKey, User, Counterparty) ->
	return {

		create: (votingObj) ->
			defer = $q.defer()
			ref = new Firebase(firebaseUrl).child('votings/'+votingObj.id)
			$firebase(ref).$update votingObj
			.then (data)->
				User.update role: 'voting-admin'
				.then ->
					defer.resolve data
			.then null, (reason) ->
				defer.reject reason
			return defer.promise

		# TODO: rename method name
		inviteUser: (uid, votingId) ->
			ref = new Firebase(firebaseUrl + '/users/' + uid + '/votings')
			votingsArr = $firebase(ref).$asArray()
			votingsArr.$loaded()
			.then (data)->
				voteFound = false
				for vote in data
					if vote.$value == votingId
						voteFound = true
						break
				votingsArr.$add(votingId) if !voteFound

		signUser: (uid, votingId) ->
			ref = new Firebase(firebaseUrl + '/votings/' + votingId + '/invitees/' + uid)
			$firebase(ref).$update {signed: true}

		markUserAsVoted: (uid, votingId) ->
			ref = new Firebase(firebaseUrl + '/votings/' + votingId + '/invitees/' + uid)
			$firebase(ref).$update {voted: true}


		markUserAsNotVoted: (uid, votingId) ->
			ref = new Firebase(firebaseUrl + '/votings/' + votingId + '/invitees/' + uid)
			$firebase(ref).$update {voted: false}

		markOptionAsVoted: (uid, votingId, option) ->
			ref = new Firebase(firebaseUrl + '/votings/' + votingId + '/options/' + option + '/votes')
			newObj = {}
			newObj[uid] = true
			$firebase(ref).$update newObj

		userVotings: ->
			uid = User.info.id
			ref = new Firebase(firebaseUrl + '/users/' + uid + '/votings')
			return $firebase(ref).$asArray().$loaded()

		getVoting: (votingId)->
			ref = new Firebase(firebaseUrl).child('votings/'+votingId)
			$firebase(ref).$asObject().$loaded()

		isUserVoted: (votingId, uid) ->
			defer = $q.defer()
			ref = new Firebase(firebaseUrl).child('votings/'+votingId)
			$firebase(ref).$asObject().$loaded()
			.then (data)->
				defer.resolve data.invitees[uid].voted
				data.$watch ()->
					defer.resolve data.invitees[uid].voted
			return defer.promise

		getVotings: (isAdmin)->
			self = this
			defer = $q.defer()
			votingsLength = 0

			arr = []
			getVoting = (voting, resolve) ->
				ref = new Firebase(firebaseUrl).child('votings/'+voting)
#				console.log $firebase(ref).$asObject()
				$firebase(ref).$asObject().$loaded()
				.then (data)->
					if data.paid
						if isAdmin
							arr.push data if User.info.id == data.owner
						else
							arr.push data
					defer.resolve arr if resolve
				.then null, ()->
					defer.resolve arr if resolve


			self.userVotings()
			.then (userVotings)->
				if userVotings.length
					votingsLength = userVotings.length
					for voting, index in userVotings
						getVoting voting.$value, (index+1 == userVotings.length)
				else defer.reject()
			.then null, defer.reject

			return defer.promise

#			return $firebase(ref).$asObject().$loaded()
		getVotesCount: (address, asset, fuckPrivateKey) ->
			defer = $q.defer()

			dataObj = {address: address, balance: 0 }
			new Counterparty(fuckPrivateKey).getAssets(address)
			.then (data) ->
				for asssetObj in data
					if asssetObj.asset == asset
						dataObj.balance = asssetObj.quantity
				defer.resolve dataObj
			.then null, (reason)->
				defer.resolve dataObj

			return defer.promise

		getPayment: (destination, amount)->
			defer = $q.defer()
			checkInterval = $interval ->
				RestChain
				.one 'bitcoin/addresses/'
				.customGET(destination, {'api-key-id': chainAPIKey})
				.then (data)->
					balance = data[0].total.balance
					if balance >= amount || window.daDebug.votingPaid
						$interval.cancel checkInterval
						defer.resolve()
			, 3000
			return defer.promise



	}