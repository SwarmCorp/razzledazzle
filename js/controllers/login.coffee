window.app.controller 'LoginController', ($rootScope, $scope, $timeout, $location, $modal, User) ->

	# Loading indicator to show/hide spinner
	$scope.loading = false

	# Watching for changes in email/password to fix angular autofill issue
	$scope.$watchCollection ->
		return [ $scope.form.login.email.$viewValue, $scope.form.login.password.$viewValue ]
	, ->
		$scope.$broadcast 'autofill:update'

	# Redirect user to homepage if logged in
	$scope.userIsLoggedIn = -> User.isLoggedIn()
	if $scope.userIsLoggedIn()
		$location.path '/'

	# Initially login form isn't submitted
	$scope.form = {}
	$scope.formSubmitted = false

	$scope.hasError = (field) ->
		email = $scope.form.login.email
		password = $scope.form.login.password
		if (field.$touched && field.$invalid) || ($scope.formSubmitted && field.$invalid)
			email.errorMessage = if email.$invalid && !email.customError then 'Valid email is required.' else email.errorMessage
			password.errorMessage = if password.$invalid && !password.customError then 'Password is required.' else password.errorMessage
			return true

	$scope.login = ->
		$scope.formSubmitted = true
		form = $scope.form.login
		email = form.email
		password = form.password
		if email.$valid && password.$dirty
			$scope.loading = true
			$scope.formSubmitted = false
			User.login email.$viewValue, password.$viewValue
			.then ->
				if User.isLoggedIn()
					if User.info.newPasswordRequired
						$scope.loading = false
						$modal.open templateUrl: 'partials/app/modal/update-password.html', controller: 'updatePasswordController', resolve: {
							data: -> password.$viewValue
						}
					else
						$scope.loading = false
						$location.path '/'
			.then null, (reason) ->
				$scope.loading = false
				switch reason.code
					when 'INVALID_EMAIL'
						email.$setValidity 'email', false
						email.customError = true
						email.errorMessage = 'Invalid email.'
					when 'INVALID_USER'
						email.$setValidity 'email', false
						email.customError = true
						email.errorMessage = 'User does not exist.'
					when 'INVALID_PASSWORD'
						password.$setValidity 'password', false
						password.customError = true
						password.errorMessage = 'Invalid password.'

	# Fixing issue with custom purpose error for password fields (manually resetting error)
#	$scope.resetPasswordValidity = ->
#		$scope.form.login.password.$setValidity 'incorrect', true
#		$scope.form.login.password.customError = false

	$scope.forgotPassword = ->
		$modal.open templateUrl: 'partials/app/modal/password-reminder.html', controller: 'passwordReminderController'
