window.app.controller 'modalNotificationController', ($scope, $sce, $modalInstance, notificationData) ->
	$scope.notificationText = notificationData.text