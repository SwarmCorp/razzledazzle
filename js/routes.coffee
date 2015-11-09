window.app.config ($routeProvider, $locationProvider) ->
	$routeProvider

		# Home page
		.when '/',
			controller: 'HomeController'
			templateUrl: 'partials/app/home.html'
			screenName: 'home'

		.when '/login',
			controller: 'LoginController'
			templateUrl: 'partials/app/login.html'
			screenName: 'home'

		.when '/projects',
			controller: 'PortfolioController'
			templateUrl: 'partials/app/portfolio.html'
			screenName: 'portfolio'

		.when '/projects/:projectName?',
			controller: 'ProjectController'
			templateUrl: 'partials/app/project.html'
			screenName: 'project'
			resolve:
			# Redirect user to /404 if project doesn't exist
				route: ($q, $route, $location, Project) ->
					defer = $q.defer()
					projectName = $route.current.params.projectName
					Project.get(projectName).then (results) ->
						if !results.project_name || (results.project_type == 'DCO' && !results.project_published)
							$location.path('/projects').replace()
							defer.reject()
						else
							defer.resolve()
						return defer.promise

		.when '/projects/:project/:bundle/checkout',
			controller: 'CheckoutController'
			templateUrl: 'partials/app/components/checkout/user.html'
			screenName: 'checkout'
			mainHeaderHidden: true

		.when '/projects/:project/:bundle/checkout/user',
			controller: 'CheckoutController'
			templateUrl: 'partials/app/components/checkout/user.html'
			screenName: 'checkout'
			mainHeaderHidden: true
			stepName: 'user'
			resolve:
				route: (CheckoutRoute, Checkout) ->
					CheckoutRoute()
					Checkout.resetFlow()

		.when '/projects/:project/:bundle/checkout/wallet',
			controller: 'CheckoutController'
			templateUrl: 'partials/app/components/checkout/wallet.html'
			screenName: 'checkout'
			mainHeaderHidden: true
			stepName: 'wallet'
			resolve:
				route: (CheckoutRoute) -> CheckoutRoute()

		.when '/projects/:project/:bundle/checkout/payment',
			controller: 'CheckoutController'
			templateUrl: 'partials/app/components/checkout/payment.html'
			screenName: 'checkout'
			mainHeaderHidden: true
			stepName: 'payment'
			resolve:
				route: (CheckoutRoute) -> CheckoutRoute()

		.when '/projects/:project/:bundle/checkout/done',
			controller: 'CheckoutController'
			templateUrl: 'partials/app/components/checkout/done.html'
			screenName: 'checkout'
			mainHeaderHidden: true
			stepName: 'done'
			resolve:
				route: (CheckoutRoute) -> CheckoutRoute()

		# Terms of use
		.when '/terms',
			controller: 'TermsController'
			templateUrl: 'partials/app/terms.html'
			screenName: 'legal'

		# Privacy policy
		.when '/privacy-policy',
			controller: 'PrivacyPolicyController'
			templateUrl: 'partials/app/privacy-policy.html'
			screenName: 'legal'

		.otherwise
				redirectTo: '/'

	$locationProvider.html5Mode(true).hashPrefix('!')