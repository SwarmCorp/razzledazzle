window.app.directive 'daSidebarDco', ($q, $timeout, $compile, Project) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/sidebar-dco.html'
	replace: true
	link: (scope, element) ->

		scope.loading = if scope.userDCO then false else true
#		scope.loading = false
		scope.project = null
		scope.editMode = false
		scope.createMode = false
#		scope.createMode = true
		scope.projectData = {}
		scope.projectPublished = false

		scope.getDCO = (promiseRequired)->
			defer = $q.defer()
			Project.getUserDCO()
			.then (data)->
				scope.userDCO = data
				scope.loaderTrigger(false)
				defer.resolve()
			if promiseRequired then return defer.promise


		scope.createProject = ()->
			scope.createModeTrigger(true)

		scope.selectProject = (project)->
			scope.loaderTrigger(true)
			Project.getDCO(project.$value)
			.then (data)->
				data.$bindTo scope, 'project'
				.then (unbind)->
					angular.copy scope.project, scope.projectData
					scope.unbindProject = unbind
					scope.loaderTrigger(false)

		scope.editModeTrigger = (value)->
			scope.editMode = value

		scope.createModeTrigger = (value)->
			scope.createMode = value

		scope.loaderTrigger = (value)->
			scope.loading = value

		scope.projectCleanup = ->
			if angular.isDefined(scope.unbindProject) then scope.unbindProject()
			scope.project = null
			scope.projectData = null

		scope.updateProjectData = (newData)->
			scope.projectData = newData

		scope.getDCO()

		scope.$on 'newDCOProject', ->
			scope.createProject()

