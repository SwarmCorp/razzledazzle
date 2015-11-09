window.app.directive 'daSidebarCms', ($timeout, $location, $route, User, Wallet, Project) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/sidebar-cms.html'
	replace: true
	link: (scope) ->
		$location.path('/projects/'+User.info.project)
		scope.projectLoaded = false

		if !scope.projectData
			scope.projectData = {}
			Project.get(scope.$parent.project || User.info.project)
			.then (data)->
				data.$bindTo scope, 'projectData'
				.then ->
					scope.projectLoaded = true
					if !scope.projectData.description then scope.projectData.description = []
					if !scope.projectData.faq then scope.projectData.faq = []

		scope.updateSalePhases = (salePhases)->
			scope.projectData.assets[assetName].pricing = salePhases

		scope.updateLogo = (file)->
			scope.projectData['project_logo'] = file[0].url
			scope.$broadcast 'projectDataUpdated'

		scope.updateCover = (file)->
			scope.projectData['project_cover'] = file[0].url
			scope.$broadcast 'projectDataUpdated'