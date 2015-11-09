window.app.filter 'vimeoVideoURL', ->
	(input) ->
		pattern = /^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/
		if (input.match(pattern)) then RegExp.$1 else false