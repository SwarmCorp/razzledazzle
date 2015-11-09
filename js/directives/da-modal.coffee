window.app.directive 'daModal', ($document, $timeout, $window, $modalStack) ->
	restrict: 'A'
	link: (scope, el) ->

		do resize = ->
			# Wait to get element load content properly.
			$timeout ->
				# Center element on screen.
				el.css
					'margin-top': -el.outerHeight() / 2
					'margin-left': -el.outerWidth() / 2
			, 0

		# Add 'ready' className in 100ms to show 'fadeIn' animation.
		$timeout ->
			el.addClass 'ready'
		, 200

		# Remove 'ready' className to show 'fadeOut' animation.
		$($document).on 'click', '.modal.backdrop', ->
			el.removeClass 'ready'

		# Kill 'resize' listener when modal window is closed
		scope.$on '$destroy', ->
			$([$window, el]).off 'resize', resize

		# Center window on window resize
		$([$window, el]).on 'resize', resize

		# Listen for broadcast to center modal window on screen
		scope.$on 'modal-center', resize

		# Close modal
		scope.fade = (event) ->

			modal = $modalStack.getTop()
			# Remove 'ready' className to show 'fadeOut' animation.
			$('.modal.backdrop').removeClass 'ready'
			el.removeClass 'ready'

			# Remove backdrop in 300ms (when CSS animation is done).
			$timeout ->
				if (modal && modal.value.backdrop && modal.value.backdrop != 'static')
					event.preventDefault()
					event.stopPropagation()
					$modalStack.dismissAll()
			, 200

window.app.directive 'daModalBackdrop', ($timeout, $modalStack) ->
	restrict: 'A'
	link: (scope, el) ->

		# Get modal window
		modal = $modalStack.getTop()

		# Add 'ready' className in 100ms to show 'fadeIn' animation.
		$timeout ->
			el.addClass 'ready'
		200

		# Remove backdrop
		scope.fade = (event) ->

			# Remove 'ready' className to show 'fadeOut' animation.
			el.removeClass 'ready'

			# Remove backdrop in 300ms (when CSS animation is done).
			$timeout ->
				if (modal && modal.value.backdrop && modal.value.backdrop != 'static')
					event.preventDefault()
					event.stopPropagation()
					$modalStack.dismissAll()
			, 300