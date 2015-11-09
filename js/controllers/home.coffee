window.app.controller 'HomeController', ($rootScope, $scope, $modal, $timeout, $sce, $firebase, firebaseUrl, Pledge, User, Sidebar, Project, RestRome) ->

	$scope.slideImages = [0,1,2,3,4,5,6,7,8,9,10,11,12]
	$scope.slideImagesLoaded = false
	$scope.slidesLoaded = 0
	$scope.slideImageLoaded = ->
		$scope.slidesLoaded++
		if ($scope.slidesLoaded / 2) == $scope.slideImages.length
			$scope.slideImagesLoaded = true

	$scope.pledgeSent = false

	Project.getProjectsCounter()
	.then (data)->
		data.$bindTo $scope, 'projectsCounter'

	$scope.submitPledge = ->
		form = $scope.form.pledge
		form.$setSubmitted()
		if form.$valid
			$scope.loading = true
			Pledge.create($scope.pledge)
			.then ->
				$scope.pledgeSent = true
				$scope.loading = false

	$scope.createDCO = ->
		if !User.isLoggedIn()
			$modal.open
				templateUrl: 'partials/app/modal/login.html',
				controller: 'modalLoginController'
				scope: $scope
		else
			Sidebar.switchSection('DCO')
			Sidebar.show()
			$timeout (->$rootScope.$broadcast 'newDCOProject'), 0

	$scope.loginCallback = $scope.createDCO

	ref = new Firebase(firebaseUrl+'/faq')
	$firebase(ref).$asObject().$loaded()
	.then (results)-> results.$bindTo($scope, 'faqs')

	$scope.toggleFaq = (faqIndex)->
		$scope.activeFaqIndex = if $scope.activeFaqIndex == faqIndex then null else faqIndex

	$scope.subscribe = ->
		form = $scope.form.subscribe
		form.email.$setValidity 'mailchimp', true
		form.email.errorMessage = null
		form.$setSubmitted()
		if form.$valid
			form.loading = true
			RestRome
				.one('newsletter/subscribers')
				.post 'add', {email: form.email.$viewValue}
				.then ->
					$scope.userSubscribed = true
					form.loading = false
				.then null, (reason)->
					form.email.errorMessage = reason.data.message
					form.email.$setValidity 'mailchimp', false
					form.loading = false