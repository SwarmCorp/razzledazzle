window.app.controller 'modalSignupController', ($scope, $modal, $modalInstance, User) ->

	# Loading indicator to show/hide spinner
	$scope.loading = false

	# Initially signup form isn't submitted
	$scope.form = {}
	$scope.formSubmitted = false

	# Submit signup form
	$scope.signup = ->
		$scope.formSubmitted = true
		form = $scope.form.signup
		firstName = form.firstName
		lastName = form.lastName
		email = form.email
		password = form.password

		# Try to authenticate if form and fields are valid
		if form.$valid || (firstName.$valid && lastName.$valid && email.$valid && $scope.passwordsMatch())
			$scope.formSubmitted = false
			$scope.loading = true
			User.create email.$viewValue, password.$viewValue
			.then ->
				email = email.$viewValue
				password = password.$viewValue
				firstName = firstName.$viewValue
				lastName = lastName.$viewValue
				User.login email, password, true
				.then ->
					User.update
						first_name: firstName
						last_name: lastName
						email: email
						wallet: null
					.then ->
						$scope.loading = false
						$modalInstance.close()
			.then null, (reason) ->
				$scope.loading = false
				switch reason.code
					when 'INVALID_EMAIL'
						email.$setValidity 'email', false
						email.customError = true
						email.errorMessage = 'Invalid email.'
					when 'EMAIL_TAKEN'
						email.$setValidity 'email', false
						email.customError = true
						email.errorMessage = 'Email address is already in use.'

	# Check fields validity (except password)
	$scope.hasError = (field) ->
		form = $scope.form.signup
		firstName = form.firstName
		lastName = form.lastName
		email = form.email
		password = form.password
		if (field.$dirty && field.$invalid) || ( ($scope.formSubmitted || $scope.formSubmitted) && field.$invalid)
			email.errorMessage = if email.$invalid && !email.customError then 'Valid email is required.' else email.errorMessage
			password.errorMessage = if password.$invalid && !password.customError then 'Password is required.' else password.errorMessage
			firstName.errorMessage = if firstName.$invalid && !firstName.customError then 'First name is required.' else firstName.errorMessage
			lastName.errorMessage = if lastName.$invalid && !lastName.customError then 'Last name is required.' else lastName.errorMessage
			email.errorMessage = if email.$invalid && !email.customError then 'Valid email is required.' else email.errorMessage
			password.errorMessage = if password.$invalid && !password.customError then 'Password is required.' else password.errorMessage
			return true

	# Check password validity
	$scope.passwordsMatch = ->
		password = $scope.form.signup.password
		passwordConfirmation = $scope.form.signup.passwordConfirm
		password.$setValidity 'password', true
		passwordConfirmation.$setValidity 'passwordConfirmation', true
		if $scope.formSubmitted
			if password.$pristine || passwordConfirmation.$pristine || password.$viewValue != passwordConfirmation.$viewValue
				if password.$pristine then password.$setValidity 'password', false
				passwordConfirmation.$setValidity 'incorrect', false
				if password.$dirty && password.$viewValue != passwordConfirmation.$viewValue
					password.$setValidity 'incorrect', true
					passwordConfirmation.errorMessage = 'Passwords must match.'
				return false
			else return true
		else
			if password.$dirty && passwordConfirmation.$dirty && password.$viewValue != passwordConfirmation.$viewValue
				if password.$pristine then password.$setValidity 'incorrect', false
				passwordConfirmation.$setValidity 'incorrect', false
				passwordConfirmation.errorMessage = 'Passwords must match.'
				return false
			else return true

	$scope.resetPasswordValidity = ->
		$scope.form.signup.password.$setValidity 'incorrect', true
		$scope.form.signup.password.customError = false

	$scope.login = ->
		$modalInstance.close()
		$modal.open templateUrl: 'partials/app/modal/login.html', controller: 'modalLoginController'

	$scope.loginWithFacebook = ->
		User.facebookLogin()
		.then ->
			$modalInstance.close()
