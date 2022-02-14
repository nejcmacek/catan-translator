{
	'use strict';

	angular
		.module('ct')
		.factory('DataProvider', DataProvider);

	DataProvider.$inject = ["$http", "$q"];

	function DataProvider($http, $q) {
		return new class {


			loading = false;
			error = false;
			items = null;
			all = null;
			categories = null;
			categoryNames = null;
			categoryKNP = null; // key-name pair.
			fetchCancellationToken = null;
			fetchPromise = null;
			popStateChangedListeners = [];


			constructor() {
				this.fetch();
			}


			fetch() {
				if (this.fetchCancellationToken)
					this.fetchCancellationToken.resolve();
				this.loading = true;
				this.error = false;
				this.fetchCancellationToken = $q.defer();
				this.fetchPromise = $http.get("data/translations.json", {
					timeout: this.fetchCancellationToken.promise
				}).then(res => {
					let all = [];
					let categories = [];
					let names = [];
					let data = {};
					let knp = {};
					for (let name in res.data) {
						let key = this.getKey(name);
						all = all.concat(res.data[name]);
						categories.push(key);
						names.push(name);
						data[key] = res.data[name];
						knp[key] = name;
					}
					this.all = [].concat(all);
					this.categories = categories;
					this.categoryNames = names;
					this.categoryKNP = knp;
					this.items = data;
					this.loading = false;
					this.error = false;
					this.fetchDefer = null;
					this.fetchPromise = null;
				}, failed => {
					this.loading = false;
					this.error = true;
					this.fetchDefer = null;
					this.fetchPromise = null;
				})
			}


			getKey(name) {
				return name.split(" ", 2)[0].trim().toLowerCase();
			}


			getName(key) {
				return this.categoryKNP[key] || null;
			}


			isValidCategoryName(catName) {
				return !!this.items[catName];
			}


		};
	}
}