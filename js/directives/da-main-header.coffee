window.app.directive 'daMainHeader', ($modal, $route, User) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/header.html'
	replace: true
	scope: false
	link: (scope) ->

		# Check if user is logged in
		scope.userIsLoggedIn = -> User.isLoggedIn()

		scope.$watch (-> User.info.loaded), (newValue)->
			scope.user = User if newValue

		scope.headerHidden = -> $route.current?.mainHeaderHidden

		scope.screenName = -> $route.current?.screenName

		# Login form is hidden by default
		scope.showLoginForm = ->
			$modal.open templateUrl: 'partials/app/modal/login.html', controller: 'modalLoginController'