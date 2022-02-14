{
	'use strict';

	angular
		.module('ct')
		.directive('ctDialog', ctDialog);

	ctDialog.$inject = ["$timeout"];

	function ctDialog($timeout) {


		function link($scope, $element, $attrs) {

			$scope.close = () => $scope.visible = false;
			$scope.$watch("visible", (visible) => {
				if (!visible) return;
				$timeout(() => {
					$timeout(resize)
				});
			});
			addEventListener("resize", resize);
			$scope.$on("$destroy", () => removeEventListener(resize));

			function resize() {
				var box = $element.children(".dialog-box");
				box.css("margin-top", box.outerHeight() / -2);
			}

		}


		return {
			link: link,
			templateUrl: "app/directives/dialog/dialog.html",
			restrict: 'E',
			transclude: true,
			scope: {
				visible: "="
			},
		};


	}
}