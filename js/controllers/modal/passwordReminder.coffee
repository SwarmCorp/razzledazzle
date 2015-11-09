window.app.controller 'passwordReminderController', ($scope, $modal, $modalInstance, User) ->

	# Loading indicator to show/hide spinner
	$scope.loading = false

	# Initially login form isn't submitted
	$scope.form = {}
	$scope.formSubmitted = false


	$scope.hasError = (field) ->
		email = $scope.form.reminder.email
		if (field.$touched && field.$invalid) || ($scope.formSubmitted && field.$invalid)
			email.errorMessage = if email.$invalid && !email.customError then 'Valid email is required.' else email.errorMessage
			return true


	$scope.remind = ->
		$scope.formSubmitted = true
		if $scope.form.reminder.$valid
			$scope.loading = true
			$scope.email = $scope.form.reminder.email
			$scope.emailValue = $scope.email.$viewValue
			User.resetPassword $scope.emailValue
			.then ()->
				$scope.formSubmitted = false
				$scope.loading = false
				$modalInstance.close()
				$modal.open templateUrl: 'partials/app/modal/notification.html', controller: 'modalNotificationController', resolve: {
					notificationData: -> {
						text: 'Instructions to reset your password have been sent to '+$scope.emailValue+'.'
					}
				}
			.then null, (reason) ->
				$scope.formSubmitted = false
				$scope.loading = false
				switch reason.code
					when 'INVALID_EMAIL'
						$scope.email.$setValidity 'email', false
						$scope.email.customError = true
						$scope.email.errorMessage = 'Invalid email.'
					when 'INVALID_USER'
						$scope.email.$setValidity 'email', false
						$scope.email.customError = true
						$scope.email.errorMessage = 'User does not exist.'