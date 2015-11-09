window.app.directive 'daHomeActionNavbar', ($window)->
	restrict: 'A'
	scope: true
	link: (scope, el)->

		windowEl = $($window)
		windowEl.on 'resize', scope.$apply.bind(scope, setNavbarVisibilityClasses)

		do setNavbarVisibilityClasses = ->
			windowHeight = $window.innerHeight
			navbarHeight = el.outerHeight()
			navbarOffset = el.offset().top
			navbarVisiblePoint = navbarOffset + navbarHeight
			scope.$parent['actionNavbar'] = {}
			scope.$parent['actionNavbar'].height = navbarHeight+'px'

			setClasses = (visibleOnTop, visibleOnBottom)->
				navbarVisible = visibleOnTop && visibleOnBottom
				stickTo = null
				if !navbarVisible
					stickTo = if !visibleOnTop then 'top' else (if !visibleOnBottom then 'bottom' else false)
				scope.$parent['actionNavbar'].stuck = !navbarVisible
				scope.navbar = {
					visible: navbarVisible
					stickTo: stickTo
				}

			do handler = ->
				scroll = $window.scrollY
				visibleOnBottom = windowHeight + scroll >= navbarVisiblePoint
				visibleOnTop = scroll <= navbarOffset
				setClasses(visibleOnTop, visibleOnBottom)

			windowEl.on 'scroll', scope.$apply.bind(scope, handler)