window.app.filter 'youtubeEmbedURL', ->
	(input) ->
		pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
		match = input.match(pattern)
		if match then 'https://www.youtube.com/embed/'+match[1] else false