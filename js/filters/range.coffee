window.app.filter 'range', ->
	(input, total) ->
		total = parseInt(total)
		i = 0
		while i < total
			input.push i
			i++
		return input