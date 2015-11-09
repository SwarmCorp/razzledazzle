###
	Directive used to fix 'autofill' issue to let Angular work correctly with saved form data.
###
window.app.directive 'daAutofill', ($timeout) ->
	restrict: 'A'
	require: 'ngModel'
	link: (scope, el, attrs, ngModel) ->
		scope.$on 'autofill:update', ->
			$timeout ->
				ngModel.$setViewValue el[0].value
			, 0