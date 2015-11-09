window.app.service 'Pledge', ($q, $firebase, firebaseUrl, Message) ->

	create: (pledgeData) ->
		defer = $q.defer()
		ref = $firebase(new Firebase(firebaseUrl+'/pledges/'))
		ref.$push(pledgeData)
		.then (data)->
			Message.sendTemplate
#				to: {email: pledgeData.email}
				to: [{
					email: 'andrew@swarmcorp.com'
				}, {
					email: 'joel@swarmcorp.com'
				}, {
					email: 'pavlo@swarmcorp.com'
				}]
				template: 'pledgetoadmin'
				templateContent: [{
					name: 'firstName'
					content: pledgeData.firstName
				}, {
					name: 'lastName'
					content: pledgeData.lastName
				}, {
					name: 'email'
					content: pledgeData.email
				}, {
					name: 'organization'
					content: pledgeData.organization
				}, {
					name: 'pledgeId'
					content: data.key()
				}]
			.then ()->
				defer.resolve()
			.then null, (reason)->
				defer.reject(reason)
		.then null, (reason)->
			defer.reject(reason)
		return defer.promise