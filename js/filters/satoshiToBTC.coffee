window.app.filter 'satoshiToBTC', ($filter)->
	(satoshi, fraction, ignoreSmallPrice) ->
		btcVal = (satoshi/100000000)
		if !angular.isDefined ignoreSmallPrice
			if btcVal < 0.000055 then btcVal = 0.000055
			btcVal = $filter('number')(btcVal, fraction || 5)
			btcVal = btcVal.replace(/,/g, '')
			btcVal = parseFloat(btcVal)
			return btcVal.toString()
		else
			return btcVal