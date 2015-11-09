'use strict'

window.app.factory 'Counterparty', ($http, $q, $timeout, RestCounterparty, counterpartyUrl) ->
	# dependencies
	oldBitcore = require 'bitcoreOld'
	bitcore = require 'bitcore'

	transactionEncoding = 'multisig'
	serverUrl = counterpartyUrl
	useCounterwalletIo = true;
	payloadDefaults =
		jsonrpc: '2.0'
		id: 0

	pubKey = null
	privateKey = null

	liveServer = null

	# try to get server url used by counterwallet itself
	# in case it changed
	getCounterwalletServerUrl = () ->
		$http.get 'https://counterwallet.io/counterwallet.conf.json'
		.success (response) ->
			servers = response.servers || []
			serverUrl = servers[0] if servers.length
			return

	getLiveServerUrl = () ->
		defer = $q.defer()
		if !liveServer
			RestRazzle
			.one 'counterparty/live-server'
			.get()
			.then (response)->
				if response.success
					liveServer = response.server
					defer.resolve liveServer
				else
					defer.reject response
			.then null, (reason)->
				defer.reject reason
		else
			defer.resolve liveServer
		return defer.promise

	###
		@param {String} unsignedTx
		@returns {String}
	###
	signRawTransaction = (unsignedHex) ->
		walletKey = new (oldBitcore.WalletKey)
		walletKey.fromObj priv: privateKey
		wkObj = walletKey.storeObj()
		address = wkObj.addr

		# function used to each for each type
		fnToSign = {}
		fnToSign[oldBitcore.Script.TX_PUBKEYHASH] = oldBitcore.TransactionBuilder::_signPubKeyHash
		fnToSign[oldBitcore.Script.TX_PUBKEY] = oldBitcore.TransactionBuilder::_signPubKey
		fnToSign[oldBitcore.Script.TX_MULTISIG] = oldBitcore.TransactionBuilder::_signMultiSig
		fnToSign[oldBitcore.Script.TX_SCRIPTHASH] = oldBitcore.TransactionBuilder::_signScriptHash

		# build key map
		wkMap = {}
		wkMap[address] = new (oldBitcore.WalletKey)(privKey: walletKey.privKey)

		# unserialize raw transaction
		raw = new (oldBitcore.Buffer)(unsignedHex, 'hex')
		unsignedTx = new (oldBitcore.Transaction)
		unsignedTx.parse raw

		# prepare  signed transaction
		signedTx = new (oldBitcore.TransactionBuilder)
		signedTx.tx = unsignedTx

		i = 0
		while i < unsignedTx.ins.length
			# init parameters
			txin = unsignedTx.ins[i]
			scriptPubKey = new (oldBitcore.Script)(txin.s)
			input =
				address: address
				scriptPubKey: scriptPubKey
				scriptType: scriptPubKey.classify()
				i: i

			# generating hash for signature
			txSigHash = unsignedTx.hashForSignature(scriptPubKey, i, oldBitcore.Transaction.SIGHASH_ALL)

			# empty the script
			signedTx.tx.ins[i].s = oldBitcore.util.EMPTY_BUFFER

			# sign hash
			ret = fnToSign[input.scriptType].call(signedTx, wkMap, input, txSigHash)

			# inject signed script in transaction object
			if ret and ret.script
				signedTx.tx.ins[i].s = ret.script
				if ret.inputFullySigned
					signedTx.inputsSigned++
				if ret.signaturesAdded
					signedTx.signaturesAdded += ret.signaturesAdded

			i++

		signedTx.tx.serialize().toString 'hex'

	###
		Send request to counterpartyd.

		@param {String} method
		@param {Object} params
		@returns {Promise}
	###
	makeAPICall = (method, params) ->
		payload =
			method: method
			params: params

		if useCounterwalletIo
			payload =
				method: 'proxy_to_counterpartyd'
				params: payload

		angular.extend(payload, payloadDefaults)

		doCall = ->
			deferred = $q.defer()

			$http.post(serverUrl, payload)
			.success (response) ->
				if response.code < 0
					errMsg = response.message + ' ' + response.data
				else if response.error
					errMsg = response.error.data.message

				return deferred.reject new Error(errMsg) if errMsg

				deferred.resolve response and response.result

			.error deferred.reject

			return deferred.promise

#		getLiveServerUrl()
#		.then (liveServer)->
#			serverUrl = 'https://'+liveServer+'/_api'
#			doCall()
#		.then null, ()->
#			console.log 'Live-server API call wasn\'t successful. Using default one.'
		doCall()

	makeFailoverAPICall = (method, params) ->
		if useCounterwalletIo
			payload =
				method: method
				params: params
		angular.extend(payload, payloadDefaults)

		doCall = ->
			deferred = $q.defer()

			$http.post(serverUrl, payload)
			.success (response) ->
				if response.code < 0
					errMsg = response.message + ' ' + response.data
				else if response.error
					errMsg = response.error.message

				return deferred.reject new Error(errMsg) if errMsg

				deferred.resolve response and response.result

			.error deferred.reject

			return deferred.promise

#		getLiveServerUrl()
#		.then (liveServer)->
#			serverUrl = 'https://'+liveServer+'/_api'
#			doCall()
#		.then null, ()->
#			console.log 'Live-server API call wasn\'t successful. Using default one.'
		doCall()


	###
		@param {String} unsignedTx
		@returns {Promise} Resolves with a broadcasted transaction hash
	###
	signAndBroadcastTransaction = (unsignedTx) ->
		makeFailoverAPICall 'broadcast_tx', {'signed_tx_hex': signRawTransaction unsignedTx}

	serverAlive = ->
		defer = $q.defer()
		RestCounterparty
		.one('_api')
		.get()
		.then (response)->
			console.log response
			defer.resolve response
		.then null, (reason)->
			console.log reason
			defer.reject reason
		return defer.promise
#		$http.get(serverUrl)
#		.success (response)->
#			defer.resolve response
#		.error (reason)->
#			defer.reject reason
#		return defer.promise


	# Factory
	counterparty = (privKey) ->

		if typeof(privKey) != 'boolean'
			throw new Error 'All counterparty actions require wallet\'s private key.' unless privKey

			# initialize
	#		getCounterwalletServerUrl() if useCounterwalletIo

			privateKey = privKey
			privateKeyObj = new (bitcore.PrivateKey)(privKey)
			pubKey = privateKeyObj.toPublicKey().toString()
			walletAddress = privateKeyObj.toAddress().toString()

		return {

			isServerAlive: serverAlive


			###
				Newly registered asset names will be either (unique) strings of 4 to 12 uppercase Latin characters (inclusive)
				not beginning with ‘A’, or integers between 26^12 + 1 and 256^8 (inclusive), prefixed with ‘A’.
				Alphabetic asset names will carry a one‐time issuance fee (by burn) of 0.5 XCP
				and numeric asset names will be freely available.
			###
			generateFreeAssetName: () ->
				min = Math.pow(26, 12) + 1
				max = Math.pow 256, 8

				randomInt = () ->
					Math.floor (Math.random() * (max - min + 1)) + min

				return 'A' + randomInt()

			###
				Issue new asset or more of an existing asset.
				To lock the issuance of the asset, specify “LOCK”

				@param {Number} quantity
				@param {String} [description]
				@param {String} [assetName]
				@returns {Promise}
			###
			createAsset: (quantity, description, assetName) ->
				params =
					source: walletAddress
					encoding: transactionEncoding
					asset: assetName
					divisible: false
					allow_unconfirmed_inputs : true
					pubkey: pubKey
					quantity: quantity

				makeAPICall 'create_issuance', params
				.then signAndBroadcastTransaction

			###
			 Send asset(s) from one address to another.

			 @param {Object} params
			 @param {String} params.destination Destination address
			 @param {String} params.asset Asset name
			 @param {String} params.quantity Amount of assets to send
			 @param {String} params.description Amount of assets to send
			 @returns {Promise}
			###
			sendAsset: (params) ->
				params.encoding = transactionEncoding
				params.source = pubKey
				params.allow_unconfirmed_inputs = true

				makeAPICall 'create_send', params
				.then signAndBroadcastTransaction

			###
        Get Asset information
			###

			getAssets: (address) ->
				makeFailoverAPICall 'get_normalized_balances', {addresses: [address || walletAddress]}

			issueAsset: (assetAmount, assetName)->
				self = this
				defer = $q.defer()
				issueAsset = (assetAmount, assetName)->
					self.createAsset(assetAmount, 'LOCK', assetName)
					.then (response)->
						if response.error
							$timeout ->
								issueAsset(assetAmount, assetName)
							, 5000
						else
							defer.resolve()
					.then null, ()->
						$timeout ->
							issueAsset(assetAmount, assetName)
						, 5000

				issueAsset(assetAmount, assetName)
				return defer.promise
		}

	return counterparty
