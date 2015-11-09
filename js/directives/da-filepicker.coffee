window.app.directive 'filepicker', ->
	restrict: 'A',
	template: '<a href ng-transclude class="{{pickerclass}}" ng-click="pickFiles()"></a>'
	transclude: true
	replace: true
	scope:
		'callback': '&'
		'pickerclass': '@'
	link: (scope, element, attrs) ->

		scope.pickFiles = ->
			picker_options =
				container: 'modal'
				access: 'public'
				mimetype: if attrs.mimetypes then eval(attrs.mimetype) else 'image/*'
				multiple: false

			path = if attrs.path then attrs.path else '/uploads/'
			container = if attrs.container then attrs.container else 'swarm.shandro'

			store_options =
				location: 'S3'
				path: path
				container: container

			filepicker.pickAndStore(picker_options, store_options, (fpfiles)->
				scope.$apply ()->
					scope.callback({file: fpfiles})
			)