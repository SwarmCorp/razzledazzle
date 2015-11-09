window.app.controller 'PortfolioController', ($scope, $interval, $filter, $location, Project, User) ->

	$scope.loading = true
	$scope.activeFilter = 'visibleProjects'

	Project.getAll()
	.then (data)->
		data.$bindTo $scope, 'projects'
		.then ()->
			$scope.loading = false

	$scope.goToProject = (project)->
		$location.path('projects/'+project.project_id)

	$scope.projectMetrics = (project)->
		return false if !project.project_coin || !project.metrics
		projectCoin = project.project_coin.toUpperCase()
		projectMetrics = {
			btc_raised: $filter('satoshiToBTC')(project.metrics.btc_raised, 2, true)
			price_increase_date: project.assets[projectCoin].pricing
			number_of_backers: project.metrics.number_of_backers
		}
		return projectMetrics

	$scope.isSaleCompleted = (project)->
		return false if !project.sale_dates
		now = moment()
		if project.sale_dates.mainsale_end_date
			mainSaleEnd = moment project.sale_dates.mainsale_end_date
			return mainSaleEnd && mainSaleEnd.diff(now) < 0

	$scope.completedSaleResult = (project)->
		return false if !project.sale_dates
		mainSaleEnd = moment project.sale_dates.mainsale_end_date
		return {
			date: mainSaleEnd.format 'DD MMMM YYYY'
			raised: $filter('satoshiToBTC')(project.metrics.btc_raised, 2)
		}

	$scope.isPresale = (project)->
		return false if !project.sale_dates
		now = moment()
		if project.sale_dates.presale_end_date
			preSaleEnd = moment project.sale_dates.presale_end_date
			return (preSaleEnd && preSaleEnd.diff(now) > 0)

	$scope.presaleData = (project)->
		return false if !project.sale_dates
		now = moment()
		preSaleEnd = moment project.sale_dates.presale_end_date
		diff = preSaleEnd.diff(now)
		return moment.duration(diff, 'ms').format('d [days] h [hours]')

	$scope.starProject = (project)->
		project.project_starred = !project.project_starred

	$scope.projectCover = (project)->
		cover = if project.project_cover then project.project_cover+'/convert?h=340&fit=scale&quality=100' else '../images/projects/projectThumbnailPlaceholder.png'
		return {'background-image': 'url('+cover+')'}

	$scope.$watch (-> User.info.loaded), (newValue)->
		if newValue
			$scope.starAvailable = User.info.role == 'super-admin'