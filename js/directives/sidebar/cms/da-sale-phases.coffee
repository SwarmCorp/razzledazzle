window.app.directive 'daSalePhases', ($timeout, $filter) ->
	restrict: 'A'
	templateUrl: 'partials/app/blocks/cms/sale-phases.html'
	replace: true
	scope: '='
	link: (scope) ->
		scope.salePhases = []
		salePhaseDraft = {name: 0, phaseName: '', startDate: '', startTime: '', endDate: '', endTime: '', startPrice: '', endPrice: ''}

		scope.today = new Date()

		scope.$watchCollection (-> scope.projectData.assets), (newValue)->
			if newValue
				assetName = scope.projectData.project_coin
				if !scope.projectData.assets[assetName].pricing then scope.projectData.assets[assetName].pricing = []
				scope.phasesOnline = scope.projectData.assets[assetName].pricing

		scope.addSalePhase = ->
			scope.saleNotFilledIn = true
			phasesLength = scope.salePhases.length
			newPhase = angular.copy salePhaseDraft
			newPhase.name += phasesLength
			scope.salePhases.push newPhase
			addPhasesValidators newPhase.name

		scope.saveSalePhase = (phase, phaseIndex)->
			form = scope.form['salePhases_'+phaseIndex]
			form.$setSubmitted()

			form['startDate_'+phase.name].$validate()
			form['endDate_'+phase.name].$validate()
			form['startPrice_'+phase.name].$validate()
			form['endPrice_'+phase.name].$validate()

			startDate = moment(phase.startDate)
#			startTime = moment(phase.startTime)
#			startHour = startTime.hours()
#			startMinute = startTime.minutes()
#			startDate.hour startHour
#			startDate.minute startMinute

			endDate = moment(phase.endDate)
#			endTime = moment(phase.endTime)
#			endHour = endTime.hours()
#			endMinute = endTime.minutes()
#			endDate.hour endHour
#			endDate.minute endMinute

			salePhase = {}
			salePhase['name'] = phase.phaseName
			salePhase['start_date'] = startDate.toISOString()
			salePhase['end_date'] = endDate.toISOString()
			salePhase['start_rate'] = $filter('btcToSatoshi')(phase.startPrice)
			salePhase['end_rate'] = $filter('btcToSatoshi')(phase.endPrice)

			if form.$valid
				scope.salePhases[phaseIndex].filledIn = true
				if angular.isDefined phase.editModeIndex
					scope.phasesOnline[phase.editModeIndex] = salePhase
				else
					scope.phasesOnline.push salePhase

				for phase, index in scope.phasesOnline
					scope.deleteSalePhase(index) if phase.type == 'initial'
					break

				scope.saleNotFilledIn = false
				scope.editModeSaleStartDate = null

		scope.editSalePhase = (phaseIndex)->
			scope.saleNotFilledIn = true
			phase = scope.phasesOnline[phaseIndex]
			scope.editModeSaleStartDate = phase.start_date
			phaseEditObj = angular.copy salePhaseDraft
			phaseEditObj.name = scope.salePhases.length
			phaseEditObj.phaseName = phase.name
			phaseEditObj.startDate = phase.start_date
			phaseEditObj.startTime = phase.start_date
			phaseEditObj.endDate = phase.end_date
			phaseEditObj.endTime = phase.end_date
			phaseEditObj.startPrice = $filter('satoshiToBTC')(phase.start_rate)
			phaseEditObj.endPrice = $filter('satoshiToBTC')(phase.end_rate)
			phaseEditObj.editModeIndex = phaseIndex
			scope.salePhases.push phaseEditObj
			addPhasesValidators phaseEditObj.name

		scope.cancelSalePhaseEdit = (phaseIndex)->
			scope.salePhases.splice phaseIndex, 1
			scope.saleNotFilledIn = false
			scope.editModeSaleStartDate = null

		scope.deleteSalePhase = (phaseIndex)->
			scope.phasesOnline.splice phaseIndex, 1
			if !scope.phasesOnline.length
				initialPhase = {}
				initialPhase['start_date'] = scope.projectData.sale_dates.mainsale_start_date
				initialPhase['end_date'] = scope.projectData.sale_dates.mainsale_end_date
				initialPhase['start_rate'] = scope.projectData.project_initial_coin_price
				initialPhase['end_rate'] = scope.projectData.project_initial_coin_price
				initialPhase['type'] = 'initial'
				scope.phasesOnline.push initialPhase

		scope.phaseDates = (phase)->
			startDate = moment(phase.start_date).format 'MM.DD'
			endDate = moment(phase.end_date).format 'MM.DD'
			return '('+startDate+' - '+endDate+')'

		addPhasesValidators = (index)->
			$timeout ->
				form = scope.form['salePhases_'+index]

				form['startDate_'+index].$validate()
				form['endDate_'+index].$validate()

				form['startPrice_'+index].$parsers.unshift (value) ->
					valid = if value then isNumber(value)
					form['startPrice_'+index].$setValidity 'price', valid
					return if valid then value else undefined

				form['startPrice_'+index].$formatters.unshift (value) ->
					valid = if value then isNumber(value)
					form['startPrice_'+index].$setValidity 'price', valid
					return value

				form['endPrice_'+index].$parsers.unshift (value) ->
					valid = if value then isNumber(value)
					form['endPrice_'+index].$setValidity 'price', valid
					return if valid then value else undefined

				form['endPrice_'+index].$formatters.unshift (value) ->
					valid = if value then isNumber(value)
					form['endPrice_'+index].$setValidity 'price', valid
					return value
			, 0

		isNumber = (n)->
			!isNaN(parseFloat(n)) && isFinite(n)