window.app.filter 'relativeDate', ->
	(date) ->
		date = moment(date).fromNow()
		return date