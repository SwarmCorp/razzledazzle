window.app.service 'CheckoutRoute', ($q, $route, $location, Checkout) ->
	return () ->
		defer = $q.defer()
		step = $route.current.stepName
		if Checkout.isRouteValid step
			defer.resolve()
		else
			project = $route.current.params.project
			bundle = $route.current.params.bundle
			$location.path('projects/'+project+'/'+bundle+'/checkout/user').replace()

		return defer.promise
