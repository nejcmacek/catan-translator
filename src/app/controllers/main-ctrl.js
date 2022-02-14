{

	"use strict";

	angular.module("ct")
		.controller("MainCtrl", MainCtrl);

	MainCtrl.$inject = ["$scope", "DataProvider", "ResultProvider"];

	function MainCtrl($scope, dataProvider, resultProvider) {
		$scope.rp = resultProvider;
		$scope.dp = dataProvider;
		$scope.costsClicked = () => $scope.costs = true;
		$scope.home = () => {
			resultProvider.clear();
		}
	}

}