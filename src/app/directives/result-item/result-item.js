{
	'use strict';

	angular
		.module('ct')
		.directive('ctResultItem', ctResultItem);

	ctResultItem.$inject = ["ResultExpansion", "$timeout", "ResultProvider"];

	function ctResultItem(resultExpansion, $timeout, resultProvider) {


		function link($scope, $element, $attrs) {

			$scope.expanded = false;
			let timeoutToken = null;
			let subheader = $element.find(".subheader");
			let subheaderVisible = true;
			let expantionToken = {
				hide: hide
			};

			function hide() {
				if (resultExpansion.token === expantionToken)
					resultExpansion.remove();
				if (!$scope.expanded) return;
				$scope.expanded = false;
				subheader.show();
				subheaderVisible = true;
				$element.removeClass("expanded");
				$timeout.cancel(timeoutToken);
			}

			function show() {
				if ($scope.expanded) return;
				$scope.expanded = true;
				$element.addClass("expanded");
				resultExpansion.set(expantionToken);
				$timeout.cancel(timeoutToken);
				$timeout(() => {
					subheader.hide();
					subheaderVisible = false;
				}, 300);
			}

			$element.click(() => {
				resultProvider.applyBounce();
				($scope.expanded ? hide : show)();
			});

			$scope.$on("$destroy", hide);

		}


		return {
			link: link,
			templateUrl: "app/directives/result-item/result-item.html",
			restrict: 'E',
			scope: {
				item: "<"
			},
		};


	}
}