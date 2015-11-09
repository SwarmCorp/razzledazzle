window.app.directive 'daSpinner', ($timeout) ->
	restrict: 'A'
	templateUrl: 'partials/app/components/spinner.html'
	replace: true
	link: (scope, el) ->

		# Add 'ready' className in 100ms to show 'fadeIn' animation.
		$timeout ->
			el.addClass 'ready'
		, 200