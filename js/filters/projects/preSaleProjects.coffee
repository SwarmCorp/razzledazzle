window.app.filter 'preSaleProjects', ->
	(projects) ->
		projectsArr = []
		starredIndex = 0
		if angular.isDefined(projects)
			now = moment()
			for key, obj of projects
				if obj && typeof(obj) == 'object' && !obj.project_hidden && obj.sale_dates?.presale_end_date && obj.project_published
					preSaleEnd = moment obj.sale_dates.presale_end_date
					if (preSaleEnd && preSaleEnd.diff(now) > 0)
						if obj.project_starred
							projectsArr.splice starredIndex, 0, obj
							starredIndex++
						else
							projectsArr.push(obj)
		return projectsArr