window.app.directive 'daValidateWalletInput', (Wallet) ->
	restrict: 'A'
	require: 'ngModel'
	link: (scope, elem, attr, ngModel) ->

		ngModel.$parsers.unshift (value) ->
			valid = if value then Wallet.check value else false
			ngModel.$setValidity 'address', valid
			return valid ? value : undefined

		ngModel.$formatters.unshift (value) ->
			valid = if value then Wallet.check value else false
			ngModel.$setValidity 'address', valid
			return value