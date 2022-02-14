{
	'use strict';

	angular
		.module('ct')
		.directive('ctIco', ctIco);

	function ctIco() {

		return {
			template: '<img class="ct-ico" src="assets/images/{{name}}.png" />', 
			replace: true,
			restrict: 'E',
			scope: {
				name: "@",
				height: "@",
				width: "@"
			},
		};


	}
}