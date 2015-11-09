window.app.directive 'daCheckoutHeader', ($window, Checkout, Project) ->
	restrict: 'A'
	templateUrl: 'partials/app/components/checkout/checkout-header.html'
	replace: true
	link: (scope, el) ->

		# Add 'checkout' class to body element. (need for page background)
		$('body').addClass 'checkout'

		# Back link action
		scope.goBack = ->
			$window.history.back()

		Project.get(Checkout.project)
		.then (data)->
			data.$bindTo(scope, 'project')

		scope.projectId = Checkout.project