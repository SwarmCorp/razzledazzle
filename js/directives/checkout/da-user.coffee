window.app.directive 'daCheckoutUser', ($timeout, $modal, Checkout, User) ->
	restrict: 'A'
	link: (scope, el) ->

		scope.termsConfirmed = false

		# Show login/signup modal window
		scope.showLoginForm = ->
			$modal.open templateUrl: 'partials/app/modal/login.html', controller: 'modalLoginController'

		scope.showSignupForm = ->
			$modal.open templateUrl: 'partials/app/modal/signup.html', controller: 'modalSignupController'

		# Skip AML step if user is logged in
		scope.$watch (-> User.info.email), (newValue) ->
			if newValue
				flow = Checkout.flow
				flow.user.firstName = User.info.firstName
				flow.user.lastName = User.info.lastName
				flow.user.email = User.info.email
				flow.user.passed = true
				Checkout.set flow, true, true
				return false

		scope.user = Checkout.flow.user

		# 'Amount' is a first stepBy, so back button in header is hidden
		scope.backStepAvailable = false

		# Initially user can see only basic form (without passwords)
		scope.extendedForm = false
		scope.passwordRequired = false
		scope.submitted = false

		# Watch if user 'extended' form. If so, set password to be required field
		scope.$watch 'extendedForm', (newValue) ->
			scope.passwordRequired = newValue

		# Save user information
		scope.saveUserInfo = ->
			scope.submitted = true
			form = scope.userForm
			if form.$valid
				flow = Checkout.flow
				flow.user.firstName = form.firstName.$viewValue
				flow.user.lastName = form.lastName.$viewValue
				flow.user.email = form.email.$viewValue
				Checkout.set Checkout[flow]

		# Check fields validity (except password)
		scope.hasError = (field) ->
			firstName = scope.userForm.firstName
			lastName = scope.userForm.lastName
			email = scope.userForm.email
			if (field.$dirty && field.$invalid) || ( (scope.loginSubmitted || scope.signupSubmitted) && field.$invalid)
				if !field.customError
					email.errorMessage = if email.$invalid then 'Valid email is required.' else null
					firstName.errorMessage = if firstName.$invalid then 'First name is required.' else null
					lastName.errorMessage = if lastName.$invalid then 'Last name is required.' else null
				return true

		scope.$watch 'termsConfirmed', (newValue) ->
			if newValue
				if scope.userForm.$valid then scope.enableNextButton() else scope.disableNextButton()


		# Enable/disable 'Next' button on form validation
		scope.$watch 'userForm.$valid', (newValue) ->
			if newValue
				if scope.termsConfirmed then scope.enableNextButton() else scope.disableNextButton()

		# Go to the next step
		scope.nextStep = ->
			return if scope.buttonNextDisabled
			if !scope.extendedForm then scope.saveUserInfo()
			flow = Checkout.flow
			if flow.user.firstName && flow.user.lastName && flow.user.email
				flow.user.passed = true
				Checkout.set Checkout[flow], true