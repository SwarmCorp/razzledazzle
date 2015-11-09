window.app.controller 'updatePasswordController', ($scope, $modalInstance, User, data) ->

	# Loading indicator to show/hide spinner
	$scope.loading = false

	# Initially login form isn't submitted
	$scope.form = {}
	$scope.formSubmitted = false

	$scope.oldPassword = data


	$scope.hasError = (field) ->
		password = $scope.form.update.newPassword
		if (field.$touched && field.$invalid) || ($scope.formSubmitted && field.$invalid)
			password.errorMessage = if password.$invalid && !password.customError then 'New password is required.' else password.errorMessage
			return true

	$scope.update = ->
		$scope.formSubmitted = true
		if $scope.form.update.$valid
			$scope.loading = true
			User.updatePassword $scope.oldPassword, $scope.form.update.newPassword.$viewValue
			.then ->
				$scope.formSubmitted = false
				$scope.loading = false
				$modalInstance.close()