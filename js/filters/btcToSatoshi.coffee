window.app.filter 'btcToSatoshi', ->
	(btc) ->
		return Math.ceil btc*100000000