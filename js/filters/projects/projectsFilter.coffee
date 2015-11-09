window.app.filter 'projectsFilter', ($filter)->
	(projects, filterName) ->
		return _.uniq $filter(filterName)(projects), (a)-> return a['project_id']