window.app.directive 'daProductDescription', ($timeout, $sce, $filter, s3bucket) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/cms/product-description.html'
	replace: true
	link: (scope) ->

		descriptionParagraphDraft = {name: 0, type: '', value: ''}

		scope.$watch (-> scope.projectLoaded), (newValue)->
			if newValue
				scope.projectDescription = []

		scope.trustSrc = (url) ->
			return $sce.trustAsResourceUrl url

		scope.addDescriptionVideo = ->
			scope.descriptionNotFilledIn = true
			descriptionLength = scope.projectDescription.length
			newParagraph = angular.copy descriptionParagraphDraft
			newParagraph.name += descriptionLength
			newParagraph.type = 'video'
			scope.projectDescription.push newParagraph
			videoLinkValidator descriptionLength

		scope.addDescriptionImage = (file)->
			newParagraph = {}
			newParagraph['type'] = 'image'
			newParagraph['value'] = file[0].url
			newParagraph['s3'] = s3bucket+file[0].key
			scope.projectData.description.push newParagraph
			scope.$broadcast 'projectDataUpdated'

		scope.addDescriptionText = ->
			scope.descriptionNotFilledIn = true
			descriptionLength = scope.projectDescription.length
			newParagraph = angular.copy descriptionParagraphDraft
			newParagraph.name += descriptionLength
			newParagraph.type = 'text'
			scope.projectDescription.push newParagraph

		scope.saveParagraph = (paragraph, paragraphIndex)->
			form = scope.form['projectDescription_'+paragraphIndex]
			form.$setSubmitted()


			newParagraph = {}
			newParagraph['type'] = paragraph.type
			newParagraph['value'] = paragraph.value
			if paragraph.type == 'video'
				newParagraph['value'] = $filter('youtubeEmbedURL')(paragraph.value) || $filter('vimeoEmbedURL')(paragraph.value)


			if form.$valid
				scope.projectDescription[paragraphIndex].filledIn = true
				scope.projectData.description.push newParagraph
				scope.descriptionNotFilledIn = false
				scope.$broadcast 'projectDataUpdated'

		scope.deleteParagraph = (paragraphIndex)->
			scope.projectData.description.splice paragraphIndex, 1

		videoLinkValidator = (index)->
			scope.$watch (-> scope.form['projectDescription_'+index]), (form)->
				if form
					form['descriptionVideo_'+index].$parsers.unshift (value) ->
						valid = if value then $filter('youtubeVideoURL')(value) || $filter('vimeoVideoURL')(value)
						form['descriptionVideo_'+index].$setValidity 'video', valid
						return if valid then value else undefined

					form['descriptionVideo_'+index].$formatters.unshift (value) ->
						valid = if value then $filter('youtubeVideoURL')(value) || $filter('vimeoVideoURL')(value)
						form['descriptionVideo_'+index].$setValidity 'video', valid
						return value