window.app.service 'Order', ($firebase, firebaseUrl, RestRome) ->

	get: (orderId) ->
		ref = new Firebase(firebaseUrl+'/orders/').child(orderId)
		return $firebase(ref).$asObject().$loaded()

	create: (project, bundle, params) ->
		RestRome
		.one 'projects', project
		.one 'bundles', bundle
		.post 'buy', params

	update: (orderId, object) ->
		ref = new Firebase(firebaseUrl+'/orders/').child(orderId)
		$firebase(ref).$update object

	cancel: (orderId) ->
		RestRome
		.one 'orders', orderId
		.post 'cancel'