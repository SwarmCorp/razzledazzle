window.app = angular.module 'Dazzle', ['ngRoute', 'ngAnimate', 'ngSanitize', 'restangular', 'firebase', 'ja.qr', 'angularytics', 'ui.bootstrap.modal', 'ui.bootstrap.datepicker', 'ui.bootstrap.timepicker', 'ui.bootstrap.tpls', 'angular-redactor']

	.constant 'discourseUrl', '//discourse.swarm.fund/'
	.constant 'counterpartyUrl', '//counterwallet.io/_api/'
	.constant 's3bucket', '//s3.amazonaws.com/swarm.shandro/'
	.constant 'firebaseUrl', if window.daDebug then 'https://'+window.daDebug.firebase+'.firebaseio.com' else 'https://blinding-fire-1884.firebaseio.com'
	.constant 'chainAPIKey', 'aa8318ad204b105287ef578fe9d42966'
	.constant 'mandrillAPIKey', 'J0ab-AhedE5pUR1BbbZ7OA'
	.constant 'mailchimpAPIKey', '491e9da46f71ad07bb3d3e1e982c8cf9-us8'
	.constant 'dazzleUrl', 'https://swarm.fund' # FIXME: change to production url
	.constant 'iOS', if navigator.userAgent.match(/(iPad|iPhone|iPod)/g) then true else false

	.config ($animateProvider) ->
		$animateProvider.classNameFilter /da-animate/

	.config (RestangularProvider) ->
		RestangularProvider.setDefaultHeaders 'Content-type': 'text/plain'

	.config (AngularyticsProvider) ->
		AngularyticsProvider.setEventHandlers ['GoogleUniversal']

	.config (datepickerConfig) ->
		datepickerConfig.showWeeks = false

	.config (redactorOptions) ->
		redactorOptions.buttons = ['formatting', '|', 'bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', '|', 'link']
		redactorOptions.formatting = []
		redactorOptions.formattingAdd = [{tag: 'p', title: 'Normal text', class: 'text-paragraph'}, {tag: 'h3', title: 'Title', class: 'text-title'}]


	.factory 'RestRome', (Restangular) ->
		Restangular.withConfig (RestangularConfigurer) ->
			RestangularConfigurer.setBaseUrl 'https://swarm-rome.herokuapp.com'
			RestangularConfigurer.setDefaultHeaders 'Content-type': 'application/json'

	.factory 'RestChain', (Restangular) ->
		Restangular.withConfig (RestangularConfigurer) ->
			RestangularConfigurer.setBaseUrl 'https://api.chain.com/v2/'

	.factory 'RestSoChain', (Restangular) ->
		Restangular.withConfig (RestangularConfigurer) ->
			RestangularConfigurer.setBaseUrl 'https://chain.so/api/v2/'

	.factory 'RestBlockscan', (Restangular) ->
		Restangular.withConfig (RestangularConfigurer) ->
			RestangularConfigurer.setBaseUrl 'https://xcp.blockscan.com/'

	.factory 'RestBlockchain', (Restangular) ->
		Restangular.withConfig (RestangularConfigurer) ->
			RestangularConfigurer.setBaseUrl 'https://blockchain.info/q'

	.factory 'RestRazzle', (Restangular) ->
		Restangular.withConfig (RestangularConfigurer) ->
			RestangularConfigurer.setBaseUrl 'https://razzle.herokuapp.com/api/'

	.factory 'RestDiscourse', (Restangular, discourseUrl) ->
		Restangular.withConfig (RestangularConfigurer) ->
			RestangularConfigurer.setBaseUrl discourseUrl

	.factory 'RestCounterparty', (Restangular) ->
		Restangular.withConfig (RestangularConfigurer) ->
			RestangularConfigurer.setBaseUrl 'https://counterparty.swarm.fund/'

	.factory 'RestMandrill', (Restangular) ->
		Restangular.withConfig (RestangularConfigurer) ->
			RestangularConfigurer.setBaseUrl 'https://us8.api.mailchimp.com/2.0/'

	.run ($rootScope, $location, $window, $interval, Angularytics, User, Checkout) ->

		# Initialize Google Analytics
		Angularytics.init()

		filepicker.setKey 'A6ijVqCLZQoO9LlNEFGxQz'

		Stripe.setPublishableKey 'pk_live_mJW1pNhkZnFJXsmEXzfFPojV'

		$rootScope.$on '$routeChangeStart', (event, next, current) ->
			if next?.screenName == 'checkout'
				projectName = next?.params.project
				bundleName = next?.params.bundle
				step = next?.stepName
				Checkout.set
					project: projectName
					bundle: bundleName
				if !step
					$location.path('projects/'+projectName+'/'+bundleName+'/checkout/user').replace()

		$rootScope.$watch () ->
			User.info.loaded
		, () ->
			if !User.isLoggedIn() && !User.info.votingWallet && $location.$$url == '/voting-signup'
				window.location.href = '/'