window.app.directive 'daDiscourseCompile', ($compile) ->
	restrict: 'A'
	link: (scope, el, attrs) ->
		scope.$watch ((scope)->scope.$eval(attrs.daDiscourseCompile)), (newValue)->
			el.html newValue
			$compile(el.contents())(scope)