window.app.directive 'daDepriciationCountdown', ($interval) ->
	restrict: 'A'
	link: (scope, el, attrs) ->
		scope.depreciation = scope.$eval attrs.depreciation
		if !scope.depreciation then return false
		durationCountInterval = $interval (-> countDuration()), 1000
		do countDuration = ->
			now = moment()
			for model, index in scope.depreciation
				finish = moment model.start_date
				diff = finish.diff now
				if diff > 0
					scope.countdown = moment.duration(diff, 'ms').format('dd:hh:mm:ss')

		scope.$on '$destroy', ->
			$interval.cancel durationCountInterval