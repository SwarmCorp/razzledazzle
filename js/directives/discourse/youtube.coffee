window.app.directive 'youtubeId', ($sce) ->
	restrict: 'A'
	templateUrl: 'partials/app/components/youtube.html'
	replace: true
	scope: {}
	link: (scope, el, attrs) ->
		scope.id = attrs.youtubeId
		scope.width = attrs.width
		scope.height = attrs.height
		scope.trustSrc = (url) ->
			return $sce.trustAsResourceUrl url