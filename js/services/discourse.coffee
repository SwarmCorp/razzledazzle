window.app.service 'Discourse', ($q, RestDiscourse) ->

	# Get project discussion
	getProjectDiscussion: (pname)->
		self = this
		discussion = []
		pname = if window.daDebug.projectDiscussion then window.daDebug.projectDiscussion else pname
		this.getTopics 'c/swarm-projects/'+pname+'.json'
		.then (data)->
			topicUsers = data.users
			topicList = data.topic_list.topics
			for topic, index in topicList
				self.getTopicPosts topic.id, index
				.then (data)->
					topic = topicList[data.topicIndex]
					topic['posts'] = data.topicData.post_stream.posts
					topic['user'] = topicPoster topic.posters, topicUsers
					if topic.pinned
						discussion.unshift topic
					else
						discussion.push topic

		# Method to get topic poster data
		topicPoster = (posters, topicUsers)->
			for poster in posters
				description = poster.description.split ','
				for role in description
					if role == 'Original Poster'
						for user in topicUsers
							if user.id == poster.user_id
								return user
		return discussion

	# Get all category topics
	getTopics: (path)->
		defer = $q.defer()
		RestDiscourse
		.one path
		.get()
		.then (data)->
			defer.resolve data
		.then null, (reason)->
			defer.reject reason
		return defer.promise

	# Get all topic posts
	getTopicPosts: (tid, position)->
		defer = $q.defer()
		RestDiscourse
		.one 't/'+tid+'.json'
		.get()
		.then (data)->
			defer.resolve {topicData: data, topicIndex: position}
		.then null, (reason)->
			defer.reject reason
		return defer.promise