window.app.directive 'daCheckoutDone', ($interval, $location, $timeout, $filter, Checkout, Project) ->
	restrict: 'A'
	link: (scope, el) ->

		project = Checkout.project

		# Hide 'Back' button in header is hidden
		scope.backStepAvailable = false

		# Redirect user to project page in 15 seconds
		scope.redirectTimeout = 15
		window.redirectTimeout = $interval ->
			scope.redirectTimeout--
			if !scope.redirectTimeout
				$interval.cancel window.redirectTimeout
				$location.path('projects/'+scope.project.$id).replace()
				$timeout ->
					location.reload()
				, 10
		, 1000

		# Initialize FB application
		window.fbAsyncInit = ->
			FB.init
				appId: '1462959267300367'
				xfbml: true
				version: 'v2.1'
		((d, s, id) ->
			fjs = d.getElementsByTagName(s)[0]
			return  if d.getElementById(id)
			fbJs = d.createElement(s)
			fbJs.id = id
			fbJs.src = "//connect.facebook.net/en_US/sdk.js"
			fjs.parentNode.insertBefore fbJs, fjs
		) document, "script", "facebook-jssdk"


		# Get project remaining days
		Project.get(project)
		.then (data)->
			data.$bindTo(scope, 'project').then ->
				scope.shareVisible = true
				scope.projectName = $filter('firstUpperCase')(scope.project.project_name)
				scope.projectDaysremaining = scope.project.metrics.days_remaining
				scope.daysLeft = scope.projectDaysremaining+' day' + if scope.projectDaysremaining > 2 then 's left' else ' left'

		# Share buttons
		scope.share =
			facebook: ->
				FB.ui
					method: 'feed',
					name: ' I just backed '+scope.projectName,
					link: 'https://www.swarm.fund/projects/'+scope.project.$id,
					picture: scope.project.project_thumbnail
					caption: scope.daysLeft,
					description: 'I just backed '+scope.projectName+' on Swarm. There are '+scope.daysLeft+' in the crowdsale. Make sure you don\'t miss it! #Swarmcorp '+scope.project.project_hashtag,
					message: ''
			twitter: ()->
				loc = encodeURIComponent 'https://www.swarm.fund/projects/'+scope.project.$id
				text = 'I just backed '+scope.projectName+' on Swarm. '+scope.daysLeft+' to go!'
				w = 580
				h = 300
				left = (screen.width/2)-(w/2)
				top = (screen.height/2)-(h/2)
				window.open 'http://twitter.com/share?text='+text+'&url='+loc+'&hashtags=Swarmcorp, '+scope.project.project_hashtag, '', 'height='+h+', width='+w+', top='+top+', left='+left+', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'