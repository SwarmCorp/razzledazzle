window.app.directive 'daSidebarUser', ($rootScope, $timeout, $modal, User, Wallet, Sidebar, Voting) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/sidebar-user.html'
	replace: true
	link: (scope) ->

		# Initialize proper form after user is logged in. Might be userInfo and userSignup (for voting wallet) form
		initializeForm = ->
			scope.userInfo = angular.copy User.info
			scope.haveToSignUp = scope.userInfo.votingWallet
			scope.$watch (-> scope.form), (newValue) ->
				if newValue
					scope.userInfoForm = scope.form.userInfo
					scope.userSignupForm = scope.form.userSignup
					scope.userForm = if scope.haveToSignUp then scope.userSignupForm else scope.userInfoForm
					scope.userForm.$setPristine()
					scope.formFields =
						firstName: scope.userForm?.firstName
						lastName: scope.userForm?.lastName
						email: scope.userForm?.email
						password: scope.userForm?.password
						newPassword: scope.userForm?.newPassword

		# Initialize form after all user-related information is loaded ('loaded' key in 'User.info' object).
		scope.$watch (-> User.info.loaded), (newValue) ->
			scope.userInfo = angular.copy User.info
			initializeForm() if newValue

		# Trigger to show userSignupForm
		scope.haveToSignUp = false

		# Loader trigger
		scope.loading = false

		# Form submit trigger
		scope.formSubmitted = false

		# Edit mode trigger for userInfo form
		scope.editMode = false

		# Change password trigger for userInfo form
		scope.changePasswordMode = false

		# Wallet download confirmation trigger
		scope.walletDownloaded = false

		# Issuing new wallet
		scope.userWallet = Wallet.new()

		# Empty form object before real form initialized
		scope.userForm = {}

		# Empty fields object before real form initialized
		scope.formFields = {}

		# Watching for 'votingWallet' key in 'User.info' object.
		# Depending on that switching between userInfo and userSignup forms
		scope.$watch (-> User.info.votingWallet), (newValue) ->
			scope.haveToSignUp = newValue

		# Method to switch between 'edit' and 'read' modes
		scope.toggleEditMode = ->
			scope.editMode = !scope.editMode
			scope.changePasswordMode = false
			scope.userForm.$setPristine()

		# Method to exit from 'edit' mode with cancelling all changes
		scope.cancelEdit = ->
			scope.toggleEditMode()
			scope.userInfo = angular.copy User.info

		# Method to switch into 'changePassword' mode
		scope.changePassword = ->
			scope.changePasswordMode = !scope.changePasswordMode

		# Method to submit form depending on current mode (signup, userInfo, changePassword).
		# Switching 'edit' to 'read' state if nothing was changed
		scope.formSubmit = ->
			if scope.userForm.$name == 'form.userSignup' then scope.userSignupFormSubmit()
			else if !scope.editMode then scope.toggleEditMode()
			else if scope.changePasswordMode then scope.newPasswordFormSubmit()
			else scope.userInfoFormSubmit()

		# Method to submit updated user information
		scope.userInfoFormSubmit = ->
			# Switch to 'read' mode if form data was untouched
			if scope.userInfoForm.$pristine
				scope.toggleEditMode()
			else
				scope.formSubmitted = true

				# If form data is valid
				if scope.userForm.$valid
					scope.loading = true

					# Trying to login (to check if user entered correct password)
					User.login scope.formFields.email.$viewValue, scope.formFields.password.$viewValue

					# If login successful, updating user info with new data
					.then ->
						data =
							first_name: scope.formFields.firstName.$viewValue
							last_name: scope.formFields.lastName.$viewValue
							email: scope.formFields.email.$viewValue
						User.update data

						# Switching to 'read' mode if update was successful
						.then ->
							scope.toggleEditMode()
							scope.formSubmitted = false
							scope.loading = false

					# Throw error if authentication was unsuccessful
					.then null, (reason) ->
						if reason.code == 'INVALID_PASSWORD'
							scope.formFields.password.$setValidity 'incorrect', false
							scope.formFields.password.customError = true
							scope.formFields.password.errorMessage = 'Invalid password.'
						scope.loading = false
						scope.formSubmitted = false

		# Method to submit signup form
		scope.userSignupFormSubmit = ->
			scope.formSubmitted = true

			# If form data is valid
			if scope.userForm.$valid
				scope.loading = true
				scope.submittedFormFields = angular.copy scope.formFields

				# Asking user to confirm that he downloaded his paper wallet before form is submitted
				scope.confirmWalletDownload()

		# Method to change user's password
		scope.newPasswordFormSubmit = ->
			scope.formSubmitted = true

			# If form data is valid
			if scope.userForm.$valid
				scope.loading = true

				# Trying to update user's password
				User.updatePassword scope.formFields.password.$viewValue, scope.formFields.newPassword.$viewValue
				.then ->
					scope.toggleEditMode()
					scope.formSubmitted = false
					scope.loading = false

				# Throw error if authentication was unsuccessful
				.then null, (reason) ->
					if reason.code == 'INVALID_PASSWORD'
						scope.formFields.password.$setValidity 'incorrect', false
						scope.formFields.password.customError = true
						scope.formFields.password.errorMessage = 'Invalid password.'
					scope.loading = false
					scope.formSubmitted = false

		# Method to show field related errors
		scope.hasError = (field) ->
			if (field?.$touched && field?.$invalid) || ( scope.formSubmitted && field?.$invalid)
				if !field?.customError
					scope.formFields.firstName?.errorMessage = if scope.formFields.firstName.$invalid then 'First name is required.' else null
					scope.formFields.lastName?.errorMessage = if scope.formFields.lastName.$invalid then 'Last name is required.' else null
					scope.formFields.email?.errorMessage = if scope.formFields.email.$invalid then 'Valid email is required.' else null
					scope.formFields.password?.errorMessage = if scope.formFields.password.$invalid then 'Password is required.' else null
					scope.formFields.newPassword?.errorMessage = if scope.formFields.newPassword.$invalid then 'New password is required.' else null
				return true

		# Fixing issue with custom purpose error for password fields (manually resetting error)
		scope.resetPasswordValidity = ->
			scope.formFields.password.$setValidity 'incorrect', true
			scope.formFields.password.customError = false

		# Method to download paperWallet. Timeout is set to fix firefox downloading issue
		scope.downloadWallet = ->
			Wallet.pdf scope.userWallet
			$timeout ->
				scope.walletDownloaded = true
			, 500

		# Showing modal window to ask user for confirmation that paperWallet is downloaded and stored
		scope.confirmWalletDownload = ->
			scope.service = 'sidebarUser'
			$modal.open
				scope: scope
				templateUrl: 'partials/app/modal/wallet-download-confirmation.html',
				controller: 'WalletDownloadConfirmController'

		# Method to update user's one-time password to real one and to store all user-related data.
		# Listening for broadcast event from confirmation modal window
		scope.$on 'paperWalletDownloaded', (event, service)->

			if service == 'sidebarUser'
				# Trying to update user's password first
				User.updatePassword User.info.temporaryPassword, scope.formFields.password.$viewValue

				# If success, updating basic user information
				.then ->
					User.update
						first_name: scope.submittedFormFields.firstName.$viewValue
						last_name: scope.submittedFormFields.lastName.$viewValue
						temporaryPassword: null
						votingWallet: null
					.then ->
						Voting.userVotings()
						.then (votingsList) ->
							for voting in votingsList
								Voting.signUser User.info.id, voting.$value

					# After information is updated switching form back to 'read' mode
					.then ->
						scope.loading = false
						scope.formSubmitted = false
						Sidebar.switchSection 'User'
						if User.info.votings
							$modal.open templateUrl: 'partials/app/modal/notification.html', controller: 'modalNotificationController', resolve: {
								notificationData: -> {
								text: 'Thank you for registering. We will contact you by email when you are able to vote.'
								}
							}