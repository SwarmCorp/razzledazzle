window.app.filter 'discourseUserAvatar', (discourseUrl)->
	(url, size) ->

		# Remove first slash in avatar URL
		url = url.substring 1

		# Set proper avatar size
		url = url.replace '{size}', size

		return discourseUrl+url