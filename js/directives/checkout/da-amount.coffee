window.app.directive 'daCheckoutAmount', (Checkout) ->
	restrict: 'A'
	link: (scope, el) ->

		# Enable 'Next' button
		scope.enableNextButton()

		# Initially 'minus' button is disabled
		scope.substractionDisabled = true

		# Amount of bundles user want to buy
		scope.amount = ->
			Checkout.flow.amount.value

		# Add 1 to Amount
		scope.addAmount = ->
			amount = scope.amount()
			scope.amount = ->
				amount+1
			scope.updateAmount()

		# Subtract 1 from Amount
		scope.subtractAmount = ->
			amount = scope.amount()
			if scope.substractionDisabled
				return
			scope.substractionDisabled = false
			scope.amount = ->
				amount-1
			scope.updateAmount()

		# Update Amount value (used when adding or subtracting)
		scope.updateAmount = ->
			scope.substractionDisabled = if scope.amount() <= 1 then true else false
			flow = Checkout.flow
			flow.amount.value = scope.amount()
			Checkout.set Checkout[flow]

		# Go to the next step
		scope.nextStep = ->
			return if scope.buttonNextDisabled
			flow = Checkout.flow
			flow.amount.passed = true
			Checkout.set Checkout[flow], true