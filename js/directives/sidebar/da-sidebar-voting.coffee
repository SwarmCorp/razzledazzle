window.app.directive 'daSidebarVoting', ($modal, Wallet, User, Voting, Counterparty) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/sidebar-voting.html'
	replace: true
	link: (scope) ->

		bitcore = require 'bitcore'

		scope.secredAccepted = false || window.daDebug?.votingSecretAccepted
		scope.voting = null

		scope.$watch (-> User.info), (newValue) ->
			scope.userInfo = User.info if newValue.loaded

		scope.$watch (-> User.info.privateKey), (newValue) ->
			scope.secredAccepted = User.info.privateKey  if newValue

		scope.$watch (-> scope.secredAccepted), (newValue) ->
			if newValue
				Voting.getVotings()
				.then (votings) ->
					scope.votings = votings
				.then null, ()->
					scope.votings = null
					scope.loading = false

		scope.checkSecret = ->
			secretField = scope.form.secret.accessSecret
			secret = secretField.$viewValue || ''
			if secret.indexOf(' ') >= 0
				publicKey = Wallet.fromPassphrase(secret)?.public
				privateKeyWIF = Wallet.fromPassphrase(secret)?.private
			else
				if secret.length == 52 then privateKey = bitcore.PrivateKey.fromWIF secret
				publicKey = privateKey?.toAddress().toString()
				privateKeyWIF = secret

			if publicKey
				secretField.$setValidity 'incorrect', true
				if publicKey != User.info.wallet
					secretField.$setValidity 'incorrect', false
					secretField.errorMessage = 'Private key or passphrase is correct, but isn\'t paired with current user account. Please contact support.'
				else
					angular.extend User.info, {privateKey: privateKeyWIF}
			else
				secretField.$setValidity 'incorrect', false
				secretField.customError = true
				secretField.errorMessage = 'Invalid private key or passphrase.'

		scope.backToVotes = ->
			scope.voting = null

		scope.selectVoting = (voting) ->
			scope.loading = true
			multipleOptions = voting.multiple
			inviteesLength = ->
				size = 0
				for id, invitee of voting.invitees
					size++
				return size
			asset = voting.asset
			votingOptions = voting.options
			do checkOptions = ->
				votedOptions = 0
				scope.$watch (-> (multipleOptions == 1 && voting.invitees[User.info.id].voted) || votedOptions >= multipleOptions), (newValue)->
					if newValue
						voting.votingDone = true
					else
						voting.votingDone = false
				for option of votingOptions
					if votingOptions[option].votes?[User.info.id]
						voting.options[option].voted = true
						votedOptions++
					Voting.getVotesCount option, asset, true
					.then (data) ->
						if data.balance
							if multipleOptions > 1
								percent = (data.balance * 100 ) / ( multipleOptions * inviteesLength() )
								votingOptions[data.address].votesCount = Math.round(percent*100)/100
							else
								percent = data.balance / inviteesLength() * 100
								votingOptions[data.address].votesCount = Math.round(percent*100)/100
						else
							votingOptions[data.address].votesCount = 0

				if (multipleOptions == 1 && voting.invitees[User.info.id].voted) || votedOptions >= multipleOptions
					voting.votingDone = true
					scope.title = voting.title
					scope.voting = voting
					scope.loading = false
				else
					User.getAsset voting.asset
					.then (balance)->
						scope.title = voting.title
						scope.voting = voting
						scope.canVote = balance > 0
						scope.loading = false
					.then null, ()->
						scope.canVote = false
						scope.loading = false
			voting.$watch (newValue)-> checkOptions() if newValue



		scope.vote = (option) ->
			return false if option.voted || scope.voting.votingDone
			if option.confirmVote
				scope.loading = true

				# Mark user as voted even before transaction is made to prevent 'double vote' UI bug
				Voting.markUserAsVoted User.info.id, scope.voting.$id
				new Counterparty(User.info.privateKey).sendAsset {
					destination: option.address
					asset: scope.voting.asset
					quantity: 1
				}
				.then ->
					Voting.markOptionAsVoted User.info.id, scope.voting.$id, option.address
					.then ()->
						Voting.markUserAsVoted User.info.id, scope.voting.$id
						.then ()->
							scope.selectVoting(scope.voting)
							scope.loading = false
				.then null, ()->
					Voting.markUserAsNotVoted User.info.id, scope.voting.$id
					$modal.open templateUrl: 'partials/app/modal/notification.html', controller: 'modalNotificationController', resolve: {
						notificationData: -> {
						text: 'Something went wrong. Please contact our <a href="mailto:support@swarmcorp.com">support team</a>.'
						}
					}
					option.confirmVote = false
					option.voted = true

			else
				votingOptions = scope.voting.options
				for votingOption of votingOptions
					votingOptions[votingOption].confirmVote = false
				option.confirmVote = true

		scope.toggleOptionAddress = (option) ->
			option.addressVisible = !option.addressVisible