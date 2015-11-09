window.app.directive 'daCopyLink', ($timeout) ->
	restrict: 'A',
	scope: false
	link: (scope, el) ->

		scope.copyLinkText = 'Copy'
		scope.linkVisible = false

		# Set path to ZeroClipboard.swf
		ZeroClipboard.config
			swfPath: '/assets/ZeroClipboard.swf'

		# Initialize ZeroClipboard
		client = new ZeroClipboard el
		client.on 'ready', (event) ->
			scope.linkVisible = true
			scope.$apply()

			client.on 'copy', (event) ->
				event.clipboardData.setData('text/plain', scope.paymentAddress)
				scope.copyLinkText = 'Copied'
				scope.$apply()

			client.on 'aftercopy', (event) ->
				$timeout ->
					scope.copyLinkText = 'Copy'
					scope.$apply()
				, 2000

			client.on 'error', (event) ->
				# Show link on ZeroClipboard is ready
				scope.$parent.linkHidden = true
				# Destroy ZeroClipboard on error (Flash not installed?)
				ZeroClipboard.destroy()