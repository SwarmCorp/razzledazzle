window.app.service 'Payment', (RestRome, RestBlockchain) ->

	getBitcoinExchangeRate: ->
		RestRome
		.one 'rates/fiat'
		.get()

	confirm: (destination)->
		RestBlockchain
		.one 'addressbalance/'+destination
		.get()