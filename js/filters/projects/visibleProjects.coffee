window.app.filter 'visibleProjects', ($filter)->
	(projects) ->
		projectsArr = []
		projectsArr = projectsArr.concat $filter('openSaleProjects')(projects)
		completedProjects = $filter('completedProjects')(projects)
		starredIndex = 0
		for key, obj of projects
			if obj && typeof(obj) == 'object'
				if obj && typeof(obj) == 'object' && !obj.project_hidden && obj.project_published
					if obj.project_starred
						projectsArr.splice starredIndex, 0, obj
						starredIndex++
					else
						projectsArr.push obj if projectsArr.indexOf(obj) == -1 && completedProjects.indexOf(obj) == -1

		projectsArr = projectsArr.concat completedProjects
		return _.uniq projectsArr, (a)-> return a['project_id']