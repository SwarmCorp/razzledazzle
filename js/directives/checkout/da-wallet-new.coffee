window.app.directive 'daCheckoutWalletNew', ($rootScope, $timeout, $modal, Checkout, Wallet) ->
	restrict: 'A'
	templateUrl: 'partials/app/components/checkout/wallet-new.html'
	link: (scope, el) ->

		scope.downloadWallet = ->
			Wallet.pdf scope.userWallet
			scope.confirmDownload() if !scope.downloadConfirmed

		scope.confirmDownload = ->
			scope.downloadConfirmed = true
			$timeout ->
				scope.service = 'checkout'
				$modal.open scope: scope, templateUrl: 'partials/app/modal/wallet-download-confirmation.html', controller: 'WalletDownloadConfirmController'
			, 500

		# Save wallet key if download is confirmed (checkbox is checked)
		scope.$on 'paperWalletDownloaded', (event, service)->
			if service == 'checkout'
				scope.downloadConfirmed = true
				flow = Checkout.flow
				flow.wallet.value = scope.userWallet.public
				flow.wallet.keys =
						public: scope.userWallet.public
						private: scope.userWallet.private
						passphrase: scope.userWallet.passphrase
				Checkout.set Checkout[flow]
				scope.enableNextButton()
				scope.nextStep()