window.app.directive 'daProductFaq', ($timeout) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/cms/product-faq.html'
	replace: true
	link: (scope) ->

		faqDraft = {name: 0, question: '', answer: ''}

		scope.$watch (-> scope.projectData.faq), (newValue)->
			if newValue
				if !scope.faqs then scope.faqs = []

		scope.addFaq = ->
			scope.faqNotFilledIn = true
			faqsLength = scope.faqs.length
			newFaq = angular.copy faqDraft
			newFaq.name += faqsLength
			scope.faqs.push newFaq

		scope.saveFaq = (faq, faqIndex)->
			form = scope.form['projectFaq_'+faqIndex]
			form.$setSubmitted()

			newParagraph = {}
			newParagraph['question'] = faq.question
			newParagraph['answer'] = faq.answer

			if form.$valid
				scope.faqs[faqIndex].filledIn = true
				if angular.isDefined faq.editModeIndex
					scope.projectData.faq[faq.editModeIndex] = faq
				else
					scope.projectData.faq.push newParagraph
				scope.faqNotFilledIn = false

		scope.editFaq = (faqIndex)->
			scope.faqNotFilledIn = true
			faq = scope.projectData.faq[faqIndex]
			faqEditObj = angular.copy faqDraft
			faqEditObj.name = scope.faqs.length
			faqEditObj.question = faq.question
			faqEditObj.answer = faq.answer
			faqEditObj.editModeIndex = faqIndex
			scope.faqs.push faqEditObj


		scope.cancelFaqEdit = (faqIndex)->
			scope.faqs.splice faqIndex, 1
			scope.faqNotFilledIn = false

		scope.deleteFaq = (faqIndex)->
			scope.projectData.faq.splice faqIndex, 1