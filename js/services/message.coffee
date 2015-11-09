window.app.service 'Message', ($q, RestRome)->

	sendTemplate: (data)->
		defer = $q.defer()
		RestRome
		.one 'messages'
		.post 'send-template', data
		.then ->
			defer.resolve()
		.then null, ->
			defer.reject()
		return defer.promise

