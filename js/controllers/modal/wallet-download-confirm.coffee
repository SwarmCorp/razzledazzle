window.app.controller 'WalletDownloadConfirmController', ($rootScope, $scope, $timeout, $modalInstance, User) ->

	$scope.loading = false
	$scope.walletDownloadConfirmed = false

	# Confirm that wallet is downloaded (used in wallet confirmation modal)
	$scope.walletDownloadConfirm = ->
		$scope.loading = true
		if User.isLoggedIn()
			User.update {wallet: $scope.userWallet.public}
			.then ->
				$scope.loading = false
				$modalInstance.close()
				$rootScope.$broadcast 'paperWalletDownloaded', $scope.service
		else
			$scope.loading = false
			$modalInstance.close()
			$rootScope.$broadcast 'paperWalletDownloaded', $scope.service

	# Get paper wallet PDF (used in wallet confirmation modal)
	$scope.getPaperWallet = ->
		$scope.downloadWallet()
		$scope.walletDownloadConfirm()