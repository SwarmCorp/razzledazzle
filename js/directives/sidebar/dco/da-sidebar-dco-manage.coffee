window.app.directive 'daSidebarDcoManage', ($timeout, $location, Project, User) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/dco/sidebar-dco-manage.html'
	replace: true
	link: (scope) ->

		scope.activeSection = 'basic'

		# Draft object for delegates list (empty for new DCO)
		if !scope.editMode
			Project.getList()
			.then (data)->
				scope.loaderTrigger(false)
				scope.projects = data

		scope.projectData = if scope.projectData then scope.projectData else {}
		scope.projectData['project_contract'] = 'https://docs.google.com/a/swarmcorp.com/document/d/1JoLaDf7jRAxYNwhG6avmKvD5euTWAesSyb8g8xuzHLI/edit'

		# Draft object for delegates list (empty for new DCO)
		delegateDraft = {name: 1, firstName: '', lastName: '', email: ''}
		scope.delegates = if scope.projectData.delegates then scope.projectData.delegates else [angular.copy delegateDraft]

		scope.addDelegate = ->
			delegatesLength = scope.delegates.length
			newDelegate = angular.copy delegateDraft
			newDelegate.name += delegatesLength
			scope.delegates.push newDelegate

		scope.removeDelegate = (delegateIndex)->
			scope.delegates.splice delegateIndex, 1

		scope.createProject = ()->
			basicData = scope.form.dco.basic
			publicData = scope.form.dco.public

			basicData.$setSubmitted()
			publicData.$setSubmitted()

			if basicData.$valid
				scope.loaderTrigger(true)
				scope.projectData['project_id'] = scope.projectData.project_name
				scope.projectData['project_owner'] = User.info.id
				scope.projectData['project_delegates'] = []
				scope.projectData['project_contract'] = addURLProtocol scope.projectData.project_contract
				scope.projectData['project_budget'] = addURLProtocol scope.projectData.project_budget
				for delegate in scope.delegates
					newObj = {}
					newObj.first_name = delegate.firstName
					newObj.last_name = delegate.lastName
					newObj.email = delegate.email
					scope.projectData['project_delegates'].push newObj

				Project.createDCO scope.projectData.project_id, scope.projectData
				.then ()->
					scope.getDCO(true)
					.then ->
						scope.loaderTrigger(false)
						scope.cancelProjectCreation()
						$location.path('projects/'+scope.projectData.project_id)

		scope.saveProject = ()->
			basicData = scope.form.dco.basic
			basicData.$setSubmitted()
			if basicData.$valid
				scope.loaderTrigger(true)

				scope.projectData['project_contract'] = addURLProtocol scope.projectData.project_contract
				scope.projectData['project_budget'] = addURLProtocol scope.projectData.project_budget
				scope.projectData['project_delegates'] = []
				for delegate in scope.delegates
					newObj = {}
					newObj.first_name = delegate.firstName
					newObj.last_name = delegate.lastName
					newObj.email = delegate.email
					scope.projectData['project_delegates'].push newObj

				Project.updateDCO scope.projectData.$id, scope.projectData
				.then ()->
					scope.loaderTrigger(false)
					scope.cancelProjectEdit()
					$location.path('projects/'+scope.projectData.project_id)

		scope.updateLogo = (file)->
			scope.projectData['project_logo'] = file[0].url

		scope.updateCover = (file)->
			scope.projectData['project_cover'] = file[0].url

		scope.cancelProjectEdit = ()->
			scope.editModeTrigger(false)
			scope.projectCleanup()

		scope.cancelProjectCreation = ->
			scope.createModeTrigger(false)
			scope.projectCleanup()

		scope.switchSection = (section)->
			scope.activeSection = section

		scope.switchPublishedState = ->
			if !scope.publicInfoFormValid
				return scope.projectData['project_published'] = false

			if !angular.isDefined(scope.projectData['project_published']) then scope.projectData['project_published'] = false
			scope.projectData['project_published'] = !scope.projectData['project_published']

		scope.$watch (-> scope.form.dco.basic.$valid), (formState)->
			scope.basicInfoFormValid = formState

		scope.$watch (-> scope.form.dco.public.$valid), (formState)->
			scope.publicInfoFormValid = formState

		addURLProtocol = (url)->
			if !url then return null
			if url.search(/^http[s]?\:\/\//) == -1
				url = 'http://'+url
			return url