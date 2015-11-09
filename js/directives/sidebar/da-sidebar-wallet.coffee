window.app.directive 'daSidebarWallet', ($rootScope, $timeout, $modal, User, Wallet) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/sidebar-wallet.html'
	replace: true
	link: (scope) ->

		scope.editMode = false

		scope.$watchCollection (-> User.info), (newValue) ->
			if newValue.loaded
				scope.userInfoLoaded = true
				scope.userInfo = User.info
				scope.userWallet = angular.copy User.info.wallet

		scope.$watch 'userWallet', (newValue) ->
			if newValue
				scope.editMode = false
				scope.loading = true
				Wallet.getAssets newValue
				.then (data) ->
					$timeout ->
						scope.assets = data
						scope.loading = false
					, 0

		scope.isAddressValid = ->
			Wallet.check scope.form.userWallet.wallet.$viewValue

		scope.createWallet = ->
			scope.newUserWallet = Wallet.new()
			Wallet.pdf(scope.newUserWallet)
			$timeout ->
				tmpScope = scope.$new()
				tmpScope['userWallet'] = scope.newUserWallet
				$modal.open
					scope: tmpScope
					templateUrl: 'partials/app/modal/wallet-download-confirmation.html',
					controller: 'WalletDownloadConfirmController'
			, 500

		scope.formSubmit = ->
			form = scope.form.userWallet
			if form.$valid
				scope.loading = true
				User.update wallet: form.wallet.$viewValue
				.then ->
					scope.editMode = false
					if scope.form.userWallet.$pristine
						scope.loading = false

		scope.$on 'paperWalletDownloaded', ->
			scope.userWallet = scope.newUserWallet.public

		scope.toggleEditMode = ->
			scope.editMode = !scope.editMode