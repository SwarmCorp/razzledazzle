window.app.directive 'daSidebarAddProject', ($timeout, $location, Sidebar, Wallet, Project, User) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/sidebar-add-project.html'
	replace: true
	link: (scope) ->

		scope.loading = true

		scope.today = new Date()

		Project.getList()
		.then (data)->
			scope.loading = false
			scope.projects = data

		scope.projectData = {}

		scope.receivingAddress = Wallet.new()
		scope.vendingAddress = Wallet.new()
		scope.projectData['payment_address'] = scope.receivingAddress
		scope.projectData['vending_address'] = scope.vendingAddress

		scope.updateLogo = (file)->
			scope.projectData['project_logo'] = file[0].url
			scope.$broadcast 'projectDataUpdated'

		scope.updateCover = (file)->
			scope.projectData['project_cover'] = file[0].url
			scope.$broadcast 'projectDataUpdated'

		scope.createProject = ()->
			form = scope.form.cms.projectBasics
			form.$setSubmitted()
			if form.$valid
				scope.projectData['project_owner'] = User.info.id
				Project.create scope.projectData.project_name, scope.projectData
				.then ()->
					scope.$parent['project'] = scope.projectData.project_name
					User.update {project: scope.projectData.project_name}
					.then ()->
						$timeout ->
							$location.path '/projects/'+scope.$parent.project
							scope.$parent.sidebar.hide()
							$timeout ->
								location.reload()
#								scope.$parent.switchSection 'Cms'
#								scope.$parent.sidebar.show()
							, 500
						, 100

		do checkProjectName = ->
			form = scope.form.cms.projectBasics
			form.projectName.$parsers.unshift (value) ->
				valid = if value then validateProjectName(value) else false
				form.projectName.$setValidity 'name', valid
				return if valid then value else undefined

			form.projectName.$formatters.unshift (value) ->
				valid = if value then validateProjectName(value) else false
				form.projectName.$setValidity 'name', valid
				return value

		validateProjectName = (value)->
			value = value.trim().toLowerCase()
			if value.split(' ').length > 1 then false else scope.projects.indexOf(value) == -1