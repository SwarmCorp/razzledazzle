window.app.controller 'MainController', ($scope, $route, Sidebar) ->

	# Toggle sidebar
	$scope.toggleSidebar = -> Sidebar.toggle()

	# Set current screen name
	$scope.bodyClass = ->
		classes = []
		if $route.current?.screenName
			classes.push 'screen-'+$route.current.screenName
		if $scope.additionalClass
			classes.push $scope.additionalClass
		return classes

	$scope.$on 'additionalBodyClass', (event, args) ->
		$scope.additionalClass = (args.class)