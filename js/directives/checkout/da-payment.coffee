window.app.directive 'daCheckoutPayment', ($interval, $timeout, $location, $filter, Checkout, Payment, Order, User) ->
	restrict: 'A'
	scope: true
	link: (scope, el, attrs) ->

		scope.projectName = Checkout.project

		# Get payment exchange rate
		Payment.getBitcoinExchangeRate()
		.then (results)->
			scope.exchangeRate = results.USD['24h_avg']

		# By default suggest user to pay in Bitcoin
		scope.paymentMethod = null

		# Let user use pay in Fiat
		scope.useFiat = ->
			cancelOrder()
			scope.paymentMethod = 'fiat'

		# Let user pay in Bitcoin
		scope.useBitcoin = ->
			cancelOrder()
			scope.paymentMethod = 'bitcoin'
			placeBitcoinOrder()
			scope.orderInProgress = true

		placeBitcoinOrder = ->
			Order.create Checkout.project, Checkout.bundle,
				user_id: Checkout.flow.user.email
				currency: 'BTC'
				receiving_address: Checkout.flow.wallet.value
				quantity: scope.bundlesAmount
				payment_type: 'bitcoin'
				exchange_rate: scope.exchangeRate
			.then (response) ->
				scope.paymentAddress = response.payment_id
				Checkout.flow.payment.orderId = response.order_id
				scope.orderInProgress = false

		placeFiatOrder = (response)->
			Order.create Checkout.project, Checkout.bundle,
				user_id: Checkout.flow.user.email
				currency: 'USD'
				receiving_address: Checkout.flow.wallet.value
				quantity: scope.bundlesAmount
				payment_type: 'stripe'
				stripe_token_id: response.id
				exchange_rate: scope.exchangeRate
			.then (response) ->
				Checkout.flow.payment.orderId = response.order_id

		cancelOrder = ->
			if Checkout.flow.payment.orderId
				scope.paymentAddress = null
				Order.cancel Checkout.flow.payment.orderId
				.then ->
					scope.$broadcast 'orderCancelled'
					Checkout.flow.payment.orderId = null

		# Set initial bundles amount
		scope.bundlesAmount = Checkout.flow.payment.amount

		# Add 1 to Amount
		scope.addAmount = ->
			scope.bundlesAmount++
			scope.updateAmount()

		# Subtract 1 from Amount
		scope.subtractAmount = ->
			if scope.substractionDisabled
				return
			scope.substractionDisabled = false
			scope.bundlesAmount--
			scope.updateAmount()

		# Update Amount value (used when adding or subtracting)
		scope.updateAmount = ->
			scope.substractionDisabled = if scope.bundlesAmount <= 1 then true else false
			flow = Checkout.flow
			flow.payment.amount = scope.bundlesAmount
			Checkout.set Checkout[flow]
			# Cancel order on amount update
			cancelOrder()
			# Create new order in two seconds after amount updated
			$timeout.cancel scope.updateOrderTimeout
			scope.updateOrderTimeout = $timeout ->
				if scope.paymentMethod == 'bitcoin' && !scope.orderInProgress
					placeBitcoinOrder()
			, 1000

		# Watch for amount change and validate (number only)
		scope.$watch 'bundlesAmount', (newValue, oldValue)->
			if isNaN(newValue) || newValue < 1
				scope.bundlesAmount = oldValue
				scope.updateAmount()
			else
				scope.bundlesAmount = newValue
				scope.updateAmount()

		scope.$watch 'payment.cardNumber', (newValue, oldValue)->
			if newValue && (newValue.length > 16 || !/^[0-9]+$/.test newValue)
					scope.payment.cardNumber=oldValue

		scope.doPayment = ->
			form = scope.paymentForm
			name = form.firstName.$viewValue+''+form.lastName.$viewValue
			cardNumber = form.cardNumber.$viewValue
			mm = form.cardExpirationMM.$viewValue
			yy = form.cardExpirationYY.$viewValue
			cvc = form.cardCVC.$viewValue
			scope.paymentDeclined = false
			if form.$valid && !scope.paymentInProgress
				scope.paymentInProgress = true
				Stripe.card.createToken {
					name: name
					number: cardNumber
					cvc: cvc
					exp_month: mm
					exp_year: yy
				}, (status, response)->
					if !response.error
						placeFiatOrder response
						.then null, (response) ->
							if response.status == 400
								scope.paymentDeclined = true
								scope.paymentInProgress = false
					else
						scope.paymentInProgress = false

		# Check fields validity
		scope.hasError = (field) ->
			validateExpiry = ->
				mm = scope.paymentForm.cardExpirationMM.$viewValue
				yy = scope.paymentForm.cardExpirationYY.$viewValue
				return !Stripe.card.validateExpiry mm, yy

			if field.$dirty
				switch field.$name
					when 'cardNumber' then return !Stripe.card.validateCardNumber field.$viewValue
					when 'cardExpirationMM' then return validateExpiry()
					when 'cardExpirationYY' then return validateExpiry()
					when 'cardCVC' then return !Stripe.card.validateCVC field.$viewValue

			if (field.$dirty && field.$invalid) || ( (scope.loginSubmitted || scope.signupSubmitted) && field.$invalid)
				return true

		# Watch for order satus changes
		scope.$watch 'order', (newValue) ->
			if newValue
				toPay = $filter('satoshiToBTC')(scope.bundle?.price * scope.bundlesAmount)
				scope.expectedTransaction = $filter('btcToSatoshi')(toPay)
				if scope.confirmationInterval
					$interval.cancel scope.confirmationInterval
					delete scope.confirmationInterval
				if newValue?.status == 'Paid'
					flow = Checkout.flow
					flow.payment.passed = true
					flow.payment.received = true
					Checkout.set flow, true, true
				else
					if newValue?.order_id && scope.confirmationInterval?.$$state.value != 'canceled'
						scope.confirmationInterval = $interval ->
							Payment.confirm newValue.order_id
							.then (result) ->
#								console.log scope.expectedTransaction
#								if result >= 0
								if result >= scope.expectedTransaction
									Order.update newValue.order_id , { status: 'Paid' }
#									 Do something to send email
						, 5000

		scope.$on 'orderCancelled', ->
			$interval.cancel scope.confirmationInterval

		scope.$on '$destroy', ->
			$interval.cancel scope.confirmationInterval

		# Watch for new order id
		scope.$watch (-> Checkout.flow.payment.orderId), (newValue) ->
			if newValue
				Order.get newValue
				.then (result) ->
					result.$bindTo(scope, 'order')
					.then (unbind)->
						scope.$watch (-> Checkout.flow.payment.orderId), (newValue) ->
							if !newValue
								unbind()

		# Detect count of decimals. If 3 - then return 3 else return 2
		scope.thousandths = (number) ->
			price = if number then number / 100000000 else 0
			decimalLength = (price.toString().split('.')[1] || []).length
			return if decimalLength == 3 then 3 else 2
