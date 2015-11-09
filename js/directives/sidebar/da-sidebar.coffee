window.app.directive 'daSidebar', (User, Sidebar) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/sidebar.html'
	replace: true
	scope: false
	link: (scope) ->

		scope.sidebar = Sidebar

		scope.section = Sidebar.section

		scope.switchSection = Sidebar.switchSection

		scope.$watch (-> Sidebar.section), (newValue)->
			if newValue then scope.section = newValue

		scope.$watch (-> User.info.loaded), (newValue)->
			scope.user = User if newValue

		scope.logout = ->
			User.logout()