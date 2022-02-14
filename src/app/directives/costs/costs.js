{
	'use strict';

	angular
		.module('ct')
		.directive('ctCosts', ctCosts);

	function ctCosts() {


		return {
			templateUrl: "app/directives/costs/costs.html",
			restrict: 'E'
		};


	}
}