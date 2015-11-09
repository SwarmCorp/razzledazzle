window.app.directive 'daImageOnLoad', ->
	restrict: 'A',
	link: (scope, el, attrs)->
		el.bind 'load', -> scope.$apply attrs.loadCallback