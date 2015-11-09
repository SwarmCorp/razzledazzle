module.exports = (grunt) ->
	# Project configuration.
	grunt.loadNpmTasks 'grunt-contrib-copy'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-angular-templates'
	grunt.loadNpmTasks 'grunt-ng-annotate'
	grunt.loadNpmTasks 'grunt-sass'
#	grunt.loadNpmTasks 'grunt-contrib-compass'
	grunt.loadNpmTasks 'grunt-recursive-compass'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-contrib-connect'
	grunt.loadNpmTasks 'grunt-shell'
	grunt.loadNpmTasks 'grunt-parallel'

	modRewrite = require 'connect-modrewrite'

	grunt.initConfig

		# Run server instance
		connect:
			development:
				options:
					base: 'dist/'
					index: 'index.html'
					port: 8081
					hostname: '127.0.0.1'
					middleware: (connect, options) ->
						middlewares = [
							modRewrite(['^[^\\.]*$ /index.html [L]'])
						]
						options.base.forEach (base) ->
							# Serve static files.
							middlewares.push connect.static(base)

						return middlewares


		# Copy static files into 'dist' directory
		copy:
			static:
				files: [
					expand: true
					cwd: 'static/'
					src: ['**', '.htaccess', '!js/vendor/bitcore/**']
					dest: 'dist/'
				]
			bower:
				files: [{
					expand: true,
					cwd: 'bower_components/zeroclipboard/dist/',
					src: 'ZeroClipboard.swf',
					dest: 'dist/assets/'
				}]


		# Concat vendor and app JS files
		concat:
			vendor:
				files:
					'dist/js/vendor.js': [
						'bower_components/jquery/dist/jquery.min.js'
						'bower_components/underscore/underscore-min.js'
						'bower_components/angular/angular.min.js'
						'bower_components/angular-route/angular-route.min.js'
						'bower_components/angular-sanitize/angular-sanitize.min.js'
						'bower_components/angular-animate/angular-animate.min.js'
						'bower_components/restangular/dist/restangular.min.js'
						'bower_components/angularytics/dist/angularytics.min.js'
						'bower_components/moment/min/moment.min.js'
						'bower_components/moment-duration-format/lib/moment-duration-format.js'
						'bower_components/qrcode/lib/qrcode.min.js'
						'bower_components/jspdf/dist/jspdf.min.js'
						'bower_components/angular-qr/angular-qr.min.js'
						'bower_components/firebase/firebase.js'
						'bower_components/angularfire/dist/angularfire.min.js'
						'bower_components/angular-ui-bootstrap/src/transition/transition.js'
						'bower_components/angular-ui-bootstrap/src/modal/modal.js'
						'bower_components/angular-ui-bootstrap/src/position/position.js'
						'bower_components/angular-ui-bootstrap/src/dateparser/dateparser.js'
						'bower_components/angular-ui-bootstrap/src/datepicker/datepicker.js'
						'bower_components/angular-ui-bootstrap/src/timepicker/timepicker.js'
						'bower_components/mnemonic.js/mnemonic.js'
						'bower_components/angular-redactor/angular-redactor.js'
						'static/js/vendor/redactor/redactor.js'
						'bower_components/bitcore/bitcore.min.js'
						'bower_components/filepicker/filepicker.min.js'
						'bower_components/zeroclipboard/dist/ZeroClipboard.min.js'
						'static/js/vendor/bitcore/bundle.js' # old Bitcore v0.1.35 for counterparty service
					]
			app:
				files:
					'dist/js/app.js': [
						'tmp/app.js'
						'tmp/templates.js'
						'tmp/bootstrap-templates.js'
						'js/*.js'
						'js/**/*.js'
						'!js/vendor/**/*.js'
					]

		# CoffeeScript compiler
		coffee:
			dev:
				options:
					sourceMap: false
				dest: 'tmp/app.js'
				src: [
					'js/debug.coffee'
					'js/dazzle.coffee'
					'js/routes.coffee'
					'js/**/*.coffee'
				]
				filter: 'isFile'
			staging:
				options:
					sourceMap: false
				dest: 'tmp/app.js'
				src: [
					'js/debug.coffee'
					'js/dazzle.coffee'
					'js/routes.coffee'
					'js/**/*.coffee'
				]
				filter: 'isFile'
			prod:
				options:
					sourceMap: false
				dest: 'tmp/app.js'
				src: [
					'js/dazzle.coffee'
					'js/routes.coffee'
					'js/**/*.coffee'
				]
				filter: 'isFile'

		# ngTemplates compiler
		ngtemplates:
			Dazzle:
				options:
					htmlmin:
						collapseBooleanAttributes:      true,
						collapseWhitespace:             true,
						removeAttributeQuotes:          true,
						removeComments:                 true,
						removeEmptyAttributes:          true,
						removeRedundantAttributes:      true,
						removeScriptTypeAttributes:     true,
						removeStyleLinkTypeAttributes:  true
				files:
					'tmp/templates.js': ['partials/**/*.html']
			'ui.bootstrap.tpls':
				options:
					standalone: true
					base: 'partials/bootstrap'
					prepend: 'template/'
					url: (module) -> module.replace /partials\/bootstrap/, 'template'
					htmlmin:
						collapseBooleanAttributes:      true
						removeAttributeQuotes:          true
						removeComments:                 true
						removeEmptyAttributes:          true
						removeRedundantAttributes:      true
						removeScriptTypeAttributes:     true
						removeStyleLinkTypeAttributes:  true
				files:
					'tmp/bootstrap-templates.js': ['partials/bootstrap/**/*.html']

		# Angular injections annotation
		ngAnnotate:
			options:
				singleQuotes: true
			app:
				files:
					'tmp/app.js': 'tmp/app.js'

		# Recursive Compass SASS framework
		'recursive-compass':
			dev:
				config: 'config.rb'
			prod:
				config: 'config.rb'
				options:
					environment: 'production'

		# Uglifying all JS
		uglify:
			js:
				files:
					'dist/js/vendor.js': 'dist/js/vendor.js'
					'dist/js/app.js': 'dist/js/app.js'

		# Clean working directories
		clean:
			dist: ['dist/']
			tmp: ['tmp/']

		# Watching for changes in HTML, CSS and JS. Everywhere inside project.
		watch:
			js:
				files: ['js/**/*.coffee']
				tasks: ['coffee:dev', 'concat:app']
			sass:
				files: ['sass/**/*']
				tasks: ['recursive-compass:dev']
			static:
				files: ['static/**/*']
				tasks: ['copy:static']
			template:
				files: ['partials/**/*.html']
				tasks: ['ngtemplates', 'concat:app']
		shell:
			firebaseDeploy:
				command: 'firebase deploy'
		parallel:
			static:
				options: grunt: true
				tasks: ['copy:static', 'copy:bower']
			build:
				options: grunt: true
				tasks: ['coffee:dev', 'ngtemplates', 'ngAnnotate', 'recursive-compass:dev']
			concatJs:
				options: grunt: true
				tasks: ['concat']


		# Deploy to Firebase
		grunt.registerTask 'firebase-deploy', (database)->
			if database
				firebaseConfigFile = 'firebase.json'
				if !grunt.file.exists firebaseConfigFile
					grunt.log.error 'Can\'t find firebase configuration file ('+firebaseConfigFile+')'
					return false
				firebaseConfig = grunt.file.readJSON firebaseConfigFile
				firebaseConfig['firebase'] = database
				grunt.file.write firebaseConfigFile, JSON.stringify(firebaseConfig, null, 2)
				grunt.task.run 'shell:firebaseDeploy'


		# Reset task is used for cleaning working directory and run 'development' task after.
		grunt.registerTask 'reset', ['clean','development']
		grunt.registerTask 'firebase-production', ['production','firebase-deploy:blinding-fire-1884', 'clean', 'development']
		grunt.registerTask 'firebase-staging', ['staging','firebase-deploy:dazzle-staging', 'clean', 'development']
		grunt.registerTask 'firebase-development', ['staging','firebase-deploy:dazzle-dev', 'clean', 'development']
		grunt.registerTask 'firebase-splash', ['staging','firebase-deploy:dazzle-splash', 'clean', 'development']
		grunt.registerTask 'firebase-voting', ['staging','firebase-deploy:dazzle-voting', 'clean', 'development']

		# Development task copying all static files, concatenating JS and launching development version of Compass.
		grunt.registerTask 'development', ['parallel', 'watch']

		# serve without Apache
		grunt.registerTask 'development-connect', [
			'copy:static'
			'copy:bower'
			'coffee:dev'
			'ngtemplates'
			'ngAnnotate'
			'concat'
			'compass:dev'
			'connect'
			'watch'
		]

		grunt.registerTask 'staging', [
			'clean'
			'copy:static'
			'copy:bower'
			'coffee:staging'
			'ngtemplates'
			'ngAnnotate'
			'concat'
			'recursive-compass:prod'
			'uglify'
		]

		# Production task cleaning working directory, copying all static files, launching production version of Compass,
		# concatenating and uglifying JS.
		grunt.registerTask 'production', [
			'clean'
			'copy:static'
			'copy:bower'
			'coffee:prod'
			'ngtemplates'
			'ngAnnotate'
			'concat'
			'recursive-compass:prod'
			'uglify'
		]
