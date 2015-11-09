window.app.filter 'completedProjects', ->
	(projects) ->
		projectsArr = []
		starredIndex = 0
		if angular.isDefined(projects)
			now = moment()
			for key, obj of projects
				if obj && typeof(obj) == 'object' && !obj.project_hidden && obj.sale_dates?.mainsale_end_date && obj.project_published
					mainSaleEnd = moment obj.sale_dates.mainsale_end_date
					if (mainSaleEnd && mainSaleEnd.diff(now) < 0)
						if obj.project_starred
							projectsArr.splice starredIndex, 0, obj
							starredIndex++
						else
							projectsArr.push(obj)
		return projectsArr