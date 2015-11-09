window.app.service 'Project', ($q, $firebase, $filter, firebaseUrl, User) ->

	# Get Project object
	get: (projectName) ->
		defer = $q.defer()
		ref = new Firebase(firebaseUrl+'/projects/').child(projectName)
		$firebase(ref).$asObject().$loaded()
		.then (data)->
			defer.resolve data
		.then null, (reason)->
			defer.reject reason
		return defer.promise

	getAll: ->
		defer = $q.defer()
		ref = new Firebase(firebaseUrl+'/projects/')
		$firebase(ref).$asObject().$loaded()
		.then (data)->
			defer.resolve data
		.then null, (reason)->
			defer.reject reason
		return defer.promise

	getList: ->
		defer = $q.defer()
		projects = []
		ref = new Firebase(firebaseUrl+'/projects/')
		$firebase(ref).$asObject().$loaded()
		.then (data)->
			data.forEach (project, index)->
				projects.push index
			defer.resolve projects
		.then null, (reason)->
			defer.reject reason
		return defer.promise


	create: (projectName, projectData) ->
		defer = $q.defer()
		ref = new Firebase(firebaseUrl+'/projects/'+projectName)

		projectData.project_coin = projectData.project_coin.toUpperCase()

		projectData['project_published'] = true

		projectData['assets'] = {}
		projectData['assets'][projectData.project_coin] = {
			name: projectData.project_coin
			pricing: []
		}
		initialPricingModel = {}
		initialPricingModel.start_date = projectData.sale_dates.mainsale_start_date
		initialPricingModel.end_date = projectData.sale_dates.mainsale_end_date
		initialPricingModel.start_rate = $filter('btcToSatoshi')(projectData.project_initial_coin_price)
		initialPricingModel.end_rate = $filter('btcToSatoshi')(projectData.project_initial_coin_price)
		initialPricingModel.type = 'initial'
		projectData['assets'][projectData.project_coin].pricing.push initialPricingModel

		wallets = {}
		wallets.project_name = projectData.project_name
		wallets.payment_wallet = projectData.payment_address
		wallets.vending_wallets = projectData.vending_address

		projectData.payment_address = projectData.payment_address.public
		projectData.vending_address = projectData.vending_address.public

		bundleAssets = {}
		bundleAssets['name'] = projectData.project_coin
		bundleAssets['quantity'] = 1

		projectData['bundles'] = {
			'BUNDLE':
				assets: [bundleAssets]
				name: 'BUNDLE'
				type: 'coin'
				price: $filter('btcToSatoshi')(projectData.project_initial_coin_price)
		}

		projectData.project_goal = $filter('btcToSatoshi')(projectData.project_goal)

		projectData.metrics = {
			btc_raised: ''
			number_of_backers: ''
		}

		$firebase(ref).$update projectData
		.then ->
			ref = new Firebase(firebaseUrl+'/project-adresses/'+projectName)
			$firebase(ref).$update wallets
			.then ()->
				defer.resolve()
		.then null, (reason)->
			defer.reject reason
		return defer.promise

	bundle: (projectName, bundleName) ->
		defer = $q.defer()
		this.get projectName
		.then (data) ->
			if data.bundles[bundleName]
				return defer.resolve data.bundles[bundleName]
			else
				defer.reject 'No bundle '+bundleName+' found in '+projectName+'.'
		.then null, (reason) ->
				defer.reject reason
		return defer.promise

	createDCO: (projectId, projectData) ->
		self = this
		timestamp = moment().unix()
		projectId = projectId.replace(/[^\w\s]/g,'_');
		projectId = projectId.split(' ').join('_')+'_'+timestamp

		userDCOs = User.info.dco || []
		userDCOs.push projectId

		projectData['project_id'] = projectId
		projectData['project_type'] = 'DCO'

		defer = $q.defer()
		ref = new Firebase(firebaseUrl+'/projects/'+projectId)
		$firebase(ref).$update projectData
		.then ->
			self.addDcoCount()
			User.update {dco: userDCOs}
			.then ()->
				defer.resolve()
		.then null, (reason)->
			defer.reject reason
		return defer.promise

	updateDCO: (projectId, projectData) ->

		updatedData = projectData
		delete updatedData.$id
		delete updatedData.$priority
		delete updatedData.delegates

		defer = $q.defer()
		ref = new Firebase(firebaseUrl+'/projects/'+projectId)
		$firebase(ref).$update updatedData
		.then ->
			defer.resolve()
		.then null, (reason)->
			defer.reject reason
		return defer.promise

	deleteDCO: (project) ->
		self = this
		defer = $q.defer()
		ref = new Firebase(firebaseUrl+'/projects/'+project.$id)

		userDCOs = User.info.dco
		projectIndex = userDCOs.indexOf project.$id
		userDCOs.splice projectIndex, 1

		$firebase(ref).$remove()
		.then ()->
			self.subtractDcoCount()
			User.update {dco: userDCOs}
			.then ()->
				defer.resolve()
		.then null, (reason)->
			defer.reject reason
		return defer.promise

	getDCO: (dco)->
		defer = $q.defer()
		ref = new Firebase(firebaseUrl+'/projects/'+dco)
		$firebase(ref).$asObject().$loaded()
		.then (data)->
			defer.resolve data
		.then null, (reason)->
			defer.reject reason
		return defer.promise

	getUserDCO: ->
		self = this
		defer = $q.defer()
		uid = User.info.id
		ref = new Firebase(firebaseUrl + '/users/' + uid + '/dco')
		dcos = []

		$firebase(ref).$asArray().$loaded()
		.then (data)->
			dcosLegth = data.length
			defer.resolve dcos if dcosLegth == 0
			data.forEach (dco, index)->
				self.getDCO dco.$value
				.then (data)->
					dco['display_name'] = data.project_name
					dcos.push dco
					if index+1 == dcosLegth
						defer.resolve dcos
		.then null, (reason)->
			defer.reject reason
		return defer.promise

	getProjectsCounter: ->
		defer = $q.defer()
		ref = new Firebase(firebaseUrl + '/counters/projects')
		$firebase(ref).$asObject().$loaded()
		.then (data)->
			defer.resolve data
		.then null, (reason)->
			defer.reject reason
		return defer.promise

	addDcoCount: ->
		defer = $q.defer()
		ref = new Firebase(firebaseUrl + '/counters/projects/dco')
		$firebase(ref).$asObject().$loaded()
		.then (data)->
			data.$value +=1
			data.$save()
			defer.resolve()
		.then null, ()->
			defer.reject()
		return defer.promise

	subtractDcoCount: ->
		defer = $q.defer()
		ref = new Firebase(firebaseUrl + '/counters/projects/dco')
		$firebase(ref).$asObject().$loaded()
		.then (data)->
			if data.$value > 0
				data.$value -=1
				data.$save()
			defer.resolve()
		.then null, ()->
			defer.reject()
		return defer.promise