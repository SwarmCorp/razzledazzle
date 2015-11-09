window.app.filter 'youtubeVideoURL', ->
	(input) ->
		pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
		if (input.match(pattern)) then RegExp.$1 else false