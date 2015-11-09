window.app.filter 'vimeoEmbedURL', ->
	(input) ->
		pattern = /^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/
		match = input.match(pattern)
		if match then 'https://player.vimeo.com/video/'+match[4] else false