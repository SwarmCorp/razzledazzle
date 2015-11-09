window.app.filter 'discourseLike', (discourseUrl)->
	(count) ->
		switch count
			when 0 then 'Nobody liked yet'
			when 1 then '1 person liked this'
			else count+' people liked this'