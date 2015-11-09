window.app.directive 'daMelotic', ($timeout) ->
	restrict: 'A'
	scope:
		market: '=tradingMarket'
	link: (scope, el, attrs) ->

		((m, e, l, o, t, i, c) ->
			m['MeloticAPIObject'] = t
			m[t] = m[t] or ->
				(m[t].q = m[t].q or []).push arguments
				return
			m[t].l = 1 * new Date
			i = e.createElement(l)
			c = e.getElementsByTagName(l)[0]
			i.async = 1
			i.src = o
			c.parentNode.insertBefore i, c
			return
		) window, document, 'script', 'https://www.melotic.com/statics/api/v1.1.js', 'melotic'

		$timeout ->
			melotic 'embed', {
				type: 'trade'
				market: scope.market
				marketsSelect: false
				container: attrs.id
				theme: 'light'
			}
		, 0