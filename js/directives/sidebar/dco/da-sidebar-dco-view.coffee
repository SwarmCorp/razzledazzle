window.app.directive 'daSidebarDcoView', ($timeout, Project) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/dco/sidebar-dco-view.html'
	replace: true
	link: (scope) ->

		scope.removeConfirmed = false

		scope.editDCO = ()->
			scope.editModeTrigger(true)
			projectData = scope.project
			scope.unbindProject()
			delegates = []
			for delegate, index in scope.project.project_delegates
				delegateObj = {}
				delegateObj['name'] = index
				delegateObj['firstName'] = delegate.first_name
				delegateObj['lastName'] = delegate.last_name
				delegateObj['email'] = delegate.email
				delegates.push delegateObj
			projectData.delegates = delegates
			scope.updateProjectData(projectData)

		scope.deleteDCO = ()->
			if scope.removeConfirmed
				scope.loaderTrigger(true)
				scope.unbindProject()
				Project.deleteDCO(scope.project)
				.then ()->
					scope.getDCO(true)
					.then ->
						scope.loaderTrigger(false)
						scope.projectCleanup()
			else
				scope.removeConfirmed = true
				$timeout ->
					scope.removeConfirmed = null
				, 3000

		scope.backToDCOs = ->
			scope.projectCleanup()