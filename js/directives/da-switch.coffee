window.app.directive 'daSwitch', ->
	restrict: 'A'
	templateUrl: 'partials/app/components/switch.html'
	replace: true
	scope:
		state: '='
		label: '='
		trigger: '='