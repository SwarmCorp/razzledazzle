window.app.service 'Checkout', ($location) ->
	defaults =
		project: null
		bundle: null
		order: null
		flow:
			user:
				isInitial: true
				passed: false
				firstName: null
				lastName: null
				email: null
				password: null
			wallet:
				passed: false
				value: null
				keys: null
			payment:
				passed: false
				amount: 1
				bitcoin: false
				fiat: false
				value: null
				received: false
				orderId: null
			done: false

	return angular.extend(

		# Update checkout flow properties
		set: (params, updateFlow, replaceRoute) ->
			angular.extend this, params
			if updateFlow then this.nextStep(replaceRoute)

		# Check if route is valid
		isRouteValid: (route)->
			prevStep = null
			for step, i of this.flow
				break if step == route
				prevStep = step
			return this.flow[route].isInitial || this.flow[route].passed || this.flow[prevStep].passed

				# Get next valid route
		nextValidRoute: ->
			lastPassed = null
			for step, i of this.flow
				if i.passed then lastPassed = step
				if step != lastPassed
					return step

		# Go to next step
		nextStep: (replaceRoute) ->
			for step, i of this.flow
				if !i.passed
					if replaceRoute
						$location.path('projects/'+this.project+'/'+this.bundle+'/checkout/'+step).replace()
					else
						$location.path('projects/'+this.project+'/'+this.bundle+'/checkout/'+step)
					return

		# Reset checkout flow to initial state
		resetFlow: (completly) ->
			storedUserData = {
				firstName: this.flow.user.firstName
				lastName: this.flow.user.lastName
				email: this.flow.user.email
			}
			defaultFlow = angular.copy defaults.flow
			angular.extend(defaultFlow.user, storedUserData)
			angular.extend(this.flow, defaultFlow)




	, defaults)
