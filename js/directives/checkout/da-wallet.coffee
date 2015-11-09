window.app.directive 'daCheckoutWallet', (User, Checkout, Wallet) ->
	restrict: 'A'

	link: (scope, el) ->

		# Skip wallet step if we have user's credentials
		scope.$watch (-> User.info.wallet), (newValue) ->
			if newValue
				flow = Checkout.flow
				flow.wallet.value = User.info.wallet
				flow.wallet.passed = true
				Checkout.set flow, true, true, 'wallet'
				return false

		# Generate wallet
		if !Checkout.flow.wallet.keys
			scope.userWallet = Wallet.new()
		else
			scope.userWallet = Checkout.flow.wallet.keys

		# By default suggesting that user doesn't have a wallet
		scope.hasWallet = if Checkout.flow.wallet.existing then Checkout.flow.wallet.existing else false

		# Let user use his existing wallet
		scope.useExisting = ->
			scope.hasWallet = true
			scope.disableNextButton()

		# Let user create a new wallet
		scope.createNew = ->
			scope.hasWallet = false
			scope.disableNextButton()

		# Go to the next step
		scope.nextStep = ->
			return if scope.buttonNextDisabled
			flow = Checkout.flow
			if flow.wallet.value
				flow.wallet.passed = true
				flow.wallet.existing = scope.hasWallet
				Checkout.set Checkout[flow], true