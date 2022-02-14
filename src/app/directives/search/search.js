{
	'use strict';

	angular
		.module('ct')
		.directive('ctSearch', ctSearch);

	function ctSearch() {


		function ctrl($scope, dataProvider, resultProvider) {

			$scope.allCategory = "all";
			$scope.query = resultProvider.query || "";
			$scope.category = resultProvider.categoryName || $scope.allCategory;

			$scope.getCategories = () =>
				dataProvider.categories;

			$scope.queryChanged = () =>
				resultProvider.setQuery($scope.query);

			$scope.categoryChanged = () =>
				resultProvider.setCategory($scope.category);

			$scope.getCategoryName = key =>
				dataProvider.getName(key);

			resultProvider.addUpdateListener(updated);

			$scope.$on("$destroy", () => {
				resultProvider.removeUpdateListener(updated);
			});


			function updated(arg) {
				$scope.query = arg.query;
				$scope.category = arg.categoryName || $scope.allCategory;
				try {
					$scope.$apply(); // this my throw, but that's ok -- we just need to be sure to update when needed
				} catch (ex) {}
			}

		}


		return {
			bindToController: true,
			controller: ["$scope", "DataProvider", "ResultProvider", ctrl],
			controllerAs: 'SearchCtrl',
			templateUrl: "app/directives/search/search.html",
			restrict: 'E',
			scope: {},
		};


	}
}