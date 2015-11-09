window.app.directive 'daCheckoutWalletExisting', (Checkout, Wallet) ->
	restrict: 'A'
	templateUrl: 'partials/app/components/checkout/wallet-existing.html'
	link: (scope, el) ->

		# Initially user didn't confirm that he controlled his key
		scope.controlConfirmed = false

		# Initially public wallet key is not valid
		scope.addressValid = false

		scope.publicKey = if Checkout.flow.wallet.existing then Checkout.flow.wallet.value else null

		# Watch if public key is valid
		scope.$watch 'publicKey', (newValue)->
			if Wallet.check newValue
				scope.addressValid = true
				scope.controlConfirmed = false
			else
				scope.addressValid = false
				scope.controlConfirmed = false

		# Save wallet key if control is confirmed
		scope.$watch 'controlConfirmed', (newValue)->
			flow = Checkout.flow
			if newValue && scope.addressValid
				flow.wallet.value = scope.publicKey
				Checkout.set Checkout[flow]
				# Enable 'Next' button
				scope.enableNextButton()
			else
				flow.wallet.value = null
				Checkout.set Checkout[flow]
				# Disable 'Next' button
				scope.disableNextButton()
