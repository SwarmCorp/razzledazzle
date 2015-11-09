window.app.controller 'CheckoutController', ($scope, Checkout, Project) ->

	# By default, back button in header is visible
	$scope.backStepAvailable = true

	# Next button text
	$scope.buttonNext = ->
		return 'Next'

	# Initially Next button is disabled
	$scope.buttonNextDisabled = true

	$scope.enableNextButton = ->
		$scope.buttonNextDisabled = false

	$scope.disableNextButton = ->
		$scope.buttonNextDisabled = true

	# Initially Next button doesn't show loader
	$scope.buttonLoading = false

	$scope.setButtonLoading = ->
		$scope.buttonLoading = true

	$scope.unsetButtonLoading = ->
		$scope.buttonLoading = false

	$scope.checkoutFlow = -> Checkout.flow

	# Get bundle
	Project.bundle(Checkout.project, Checkout.bundle)
	.then (result) ->
		$scope.bundle = result

	# Get current checkout flow step
	$scope.step = ->
		return Checkout.step

	# Go to next step
	$scope.nextStep = (step) ->
		flow = Checkout.flow
		currentStep =
			switch $scope.step()
				when 'wallet-new', 'wallet-existing' then 'wallet'
				when 'payment-bitcoin', 'payment-fiat' then 'payment'
				else $scope.step()
		flow.step = step
		flow[currentStep].passed = true
		Checkout.set flow, true