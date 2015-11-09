window.app.controller 'ProjectController', ($scope, $location, $route, $sce, $timeout, $interval, $filter, Project, Discourse, Payment, User, Sidebar) ->

	$scope.projectName = $route.current?.params.projectName

	isDCO = (project)->
		return true if project.project_type && project.project_type == 'DCO'

	# Get project data
	Project.get $scope.projectName
	.then (data)->
		data.$bindTo $scope, 'project'
		.then ()->
			$scope.projectName = $filter('firstUpperCase')($scope.project.project_name)

			if !isDCO($scope.project)
				$scope.isDCO = false
				$scope.updateMetrics()
				nextPriceIncrease()
				$interval nextPriceIncrease, 1000

				Payment.getBitcoinExchangeRate()
				.then (results)->
					exchangeRate = results.USD['24h_avg']
					assetsAmount = $scope.project.bundles['BUNDLE'].assets[0].quantity
					bundlePrice = $scope.project.bundles['BUNDLE'].price
					coinPrice = $filter('satoshiToBTC')(bundlePrice/assetsAmount, undefined, true)
					$scope.coinsForDollar = (coinPrice*exchangeRate)
			else
				$scope.isDCO = true

	$scope.projectMetrics = {
		coins_per_btc: ''
		days_remaining: ''
		goal: ''
		number_of_backers: ''
		price_increase_date: ''
	}

	nextPriceIncrease = ->
		return false if isDCO($scope.project)
		now = new Date()
		depreciationModel = $scope.project.assets[$scope.project.project_coin].pricing
		if !depreciationModel then return false
		for model, index in depreciationModel
			finish = moment model.start_date
			diff = finish.diff now
			if diff > 0
				$scope.projectMetrics.price_increase_date = moment.duration(diff, 'ms').format('dd:hh:mm:ss')
				break

	daysToGo = ->
		now = new Date()
		saleEnds = moment $scope.project.sale_dates.mainsale_end_date
		diff = saleEnds.diff now
		$scope.projectMetrics.days_remaining = moment.duration(diff, 'ms').format('d')

	$scope.updateMetrics = ->
		return false if isDCO($scope.project)
		$scope.projectMetrics.number_of_backers = $scope.project.metrics.number_of_backers
		daysToGo()

	$scope.toggleSocial = ->
		$scope.socialVisible = !$scope.socialVisible

	# Set active project section (description, discussion, share)
	$scope.projectSection = 'description'

	# Method to change active project section
	$scope.setSection = (section)->
		if section == 'discussion'
			# Get project discussion
			$scope.projectDiscussion = Discourse.getProjectDiscussion $scope.project.company.forum
		$scope.projectSection = section

	$scope.projectCover = (project)->
		if project
			cover = if project.project_cover then project.project_cover else '../images/projects/projectCoverPlaceholder.png'
			return {'background-image': 'url('+cover+')'}

	$scope.fund = ->
		$location.path('/projects/'+$scope.project.$id+'/BUNDLE/checkout')

	$scope.trust = (html)->
		$sce.trustAsHtml html

	$scope.trustSrc = (url)->
		return $sce.trustAsResourceUrl url

	$scope.toggleFaq = (faqIndex)->
		$scope.activeFaqIndex = if $scope.activeFaqIndex == faqIndex then null else faqIndex