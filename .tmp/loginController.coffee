window.app.controller 'LoginController', ($scope, $modalInstance, User) ->

	$scope.form = {}

	$scope.loginSubmitted = false
	$scope.signupSubmitted = false

	$scope.formType = -> 'login'

	$scope.switchForm = (formType) ->
		$scope.loginSubmitted = false
		$scope.signupSubmitted = false
		$scope.formType = -> formType

	# Check fields validity (except password)
	$scope.hasError = (field) ->
#		form = if $scope.loginSubmitted then $scope.form.login else $scope.form.signup
		email = $scope.form.login.email
		password = $scope.form.login.password
		firstName = $scope.form.signup.firstName
		lastName = $scope.form.signup.lastName
		signUpEmail = $scope.form.signup.email
		signUpPassword = $scope.form.signup.password
		if (field.$dirty && field.$invalid) || ( ($scope.loginSubmitted || $scope.signupSubmitted) && field.$invalid)
			if !field.customError
				email.errorMessage = if email.$invalid then 'Valid email is required.' else null
				password.errorMessage = if password.$invalid then 'Password is required.' else null
				firstName.errorMessage = if firstName.$invalid then 'First name is required.' else null
				lastName.errorMessage = if lastName.$invalid then 'Last name is required.' else null
				signUpEmail.errorMessage = if signUpEmail.$invalid then 'Valid email is required.' else null
				signUpPassword.errorMessage = if signUpPassword.$invalid then 'Password is required.' else null
			return true

	# Check password validity
	$scope.passwordsMatch = ->
		password = $scope.form.signup.password
		passwordConfirm = $scope.form.signup.passwordConfirm
		password.$setValidity 'password', true
		passwordConfirm.$setValidity 'passwordConfirm', true
		if $scope.signupSubmitted
			if password.$pristine || passwordConfirm.$pristine || password.$viewValue != passwordConfirm.$viewValue
				if password.$pristine then password.$setValidity 'password', false
				passwordConfirm.$setValidity 'passwordConfirm', false
				if password.$dirty && password.$viewValue != passwordConfirm.$viewValue
					password.$setValidity 'password', true
					passwordConfirm.errorMessage = 'Passwords must match.'
				return false
			else return true
		else
			if password.$dirty && passwordConfirm.$dirty && password.$viewValue != passwordConfirm.$viewValue
				if password.$pristine then password.$setValidity 'password', false
				passwordConfirm.$setValidity 'passwordConfirm', false
				passwordConfirm.errorMessage = 'Passwords must match.'
				return false
			else return true

	$scope.login = ->
		$scope.loginSubmitted = true
		form = $scope.form.login
		email = form.email
		password = form.password
		remember = form.remember

		# Try to authenticate if form and fields are valid
		if form.$valid || (email.$$validityState.valid && password.$$validityState.valid)
			$scope.loginSubmitted = false
			User.login email.$viewValue, password.$viewValue, remember.$viewValue
			.then ->
				if User.isLoggedIn()
					$modalInstance.close()
			.then null, (reason) ->
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

	$scope.signup = ->
		$scope.signupSubmitted = true
		form = $scope.form.signup
		firstName = form.firstName
		lastName = form.lastName
		signUpEmail = form.email
		signUpPassword = form.password

		# Try to authenticate if form and fields are valid
		if form.$valid || (firstName.$$validityState.valid && lastName.$$validityState.valid && signUpEmail.$$validityState.valid && $scope.passwordsMatch())
			$scope.signupSubmitted = false
			User.create signUpEmail.$viewValue, signUpPassword.$viewValue
			.then ->
				email = signUpEmail.$viewValue
				password = signUpPassword.$viewValue
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
						$modalInstance.close()
			.then null, (reason) ->
				switch reason.code
					when 'INVALID_EMAIL'
						signUpEmail.$setValidity 'email', false
						signUpEmail.customError = true
						signUpEmail.errorMessage = 'Invalid email.'
					when 'EMAIL_TAKEN'
						signUpEmail.$setValidity 'email', false
						signUpEmail.customError = true
						signUpEmail.errorMessage = 'Email address is already in use.'