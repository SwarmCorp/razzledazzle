window.app.factory 'Sidebar', ($injector, $location, $timeout, Counterparty)->

	Sidebar = ->

		# Sidebar is invisible by default
		visible: false || window.daDebug?.sidebarVisible

		# Initial section is set to 'User'
		section: window.daDebug?.sidebarActiveSection || 'User'

		counterpartyAlive: false

		# Method to toggle sidebar
		toggle: ->
			this.visible = !this.visible

		# Method to show sidebar
		show: ->
			this.visible = true

		# Method to hide sidebar
		hide: ->
			this.visible = false

		switchSection: (section) ->
			this.section = section

		availableSections: ->
			User = $injector.get 'User'
			return {
				user: true
				voteAdmin: this.counterpartyAlive
				vote: this.counterpartyAlive
				wallet: true
				addProject: User.info.role == 'project-admin' && !User.info.project
				cms: User.info.project
				DCO: true
			}

#	do checkLiveCounterpartyServer = ->
#		sidebar = new Sidebar()
#		Counterparty(false).isServerAlive()
#		.then () ->
#			sidebar.counterpartyAlive = true
#		.then null, () ->
#			sidebar.counterpartyAlive = false

	return new Sidebar()