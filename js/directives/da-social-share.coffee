window.app.directive 'daSocialShare', ($timeout)->
	restrict: 'A'
	scope:
		type: '='
		name: '='
		link: '='
		picture: '='
		caption: '='
		description: '='
		tags: '='
	link: (scope, el) ->

		# Call share method
		el.on 'click', ->
			share[scope.type]()

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

		# Share buttons
		share =
			facebook: ->
				tags = ''
				if scope.tags.length > 1
					for hashtag, index in scope.tags
						if index > 0
							tags += ' #'+hashtag
						else
							tags += ' #'+hashtag
				else
					tags = '#'+scope.tags[0]
				FB.ui
					method: 'feed',
					name: scope.name
					link: scope.link
					picture: scope.picture
					caption: scope.caption
					description: scope.description+tags
					message: ''
			twitter: ->
				tags = ''
				location = encodeURIComponent scope.link
				width = 580
				height = 300
				left = (screen.width/2)-(width/2)
				top = (screen.height/2)-(height/2)
				window.open 'http://twitter.com/share?text='+scope.description+'&url='+location+'&hashtags='+scope.tags, '', 'height='+height+', width='+width+', top='+top+', left='+left+', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
			googleplus: ->
				location = encodeURIComponent scope.link
				width = 580
				height = 300
				left = (screen.width/2)-(width/2)
				top = (screen.height/2)-(height/2)
				window.open 'https://plus.google.com/share?url='+location, scope.description, 'height='+height+', width='+width+', top='+top+', left='+left+', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'