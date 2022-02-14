{
	'use strict';

	angular.module("ct")
		.service("ResultProvider", ResultProvider);

	ResultProvider.$inject = ["DataProvider", "$timeout"];

	function ResultProvider(dataProvider, $timeout) {
		return new class {


			query = null;
			queryTooLong = false;
			categoryName = null;
			results = [];
			fuseOptions = {
				shouldSort: true,
				threshold: 0.25,
				location: 0,
				distance: 1000,
				maxPatternLength: 64,
				keys: [{
					name: "title",
					weight: 0.65
				}, {
					name: "translation",
					weight: 0.3
				}, {
					name: "description",
					weight: 0.05
				}]
			};
			updateListeners = [];
			bounceTimeout = 4000;
			bounceTimeoutToken = null;


			constructor() {
				addEventListener("popstate", () => this.setFromUrl());

				if (dataProvider.loading)
					dataProvider.fetchPromise.then(() => this.setFromUrl());
				else if (dataProvider.items)
					this.setFromUrl();
				else
					dataProvider.fetch();
			}


			/**
			 * @param query {string}
			 */
			setQuery(query) {
				query = (query ? query.trim() : query) || null;
				if (query == this.query)
					return;
				this.query = query;
				this.updateQueryTooLong();
				this.update();
				this.updateStateBounce();
			}


			updateQueryTooLong() {
				this.queryTooLong = this.query && this.query.length > this.fuseOptions.maxPatternLength;
			}


			/**
			 * @param cat {Category|string}
			 */
			setCategory(categoryName) {
				categoryName = (categoryName ? categoryName.trim() : categoryName) || null;
				if (categoryName == this.categoryName)
					return;
				this.categoryName = categoryName;
				this.update();
				this.updateState();
			}


			clear() {
				this.fromState({
					query: null,
					categoryName: null
				}, true);
			}


			applyBounce() {
				if (!this.bounceTimeoutToken) return;

				$timeout.cancel(this.bounceTimeoutToken);
				this.updateState();
			}


			updateStateBounce() {
				if (this.bounceTimeoutToken)
					$timeout.cancel(this.bounceTimeoutToken);
				this.bounceTimeoutToken = $timeout(() => {
					this.updateState();
					this.bounceTimeoutToken = null;
				}, this.bounceTimeout)
			}


			updateState() {
				if (this.bounceTimeoutToken)
					$timeout.cancel(this.bounceTimeoutToken);
				var url = "?";
				if (this.query)
					url += "q=" + encodeURIComponent(this.query);
				if (this.query && this.categoryName)
					url += "&";
				if (this.categoryName)
					url += "cat=" + encodeURIComponent(this.categoryName);
				if (url.length === 1)
					url = location.pathname;
				if (url == location.search)
					return;
				history.pushState({
					categoryName: this.categoryName,
					query: this.query
				}, document.title, url);
			}


			fromState(obj, updateState = false) {
				let query = null;
				let categoryName = null;
				if (obj) {
					query = (obj.query ? obj.query.trim() : obj.query) || null;
					categoryName = (obj.categoryName ? obj.categoryName.trim() : obj.categoryName) || null;
					if (categoryName && !dataProvider.isValidCategoryName(categoryName))
						categoryName = null;
				}
				let update = query != this.query || categoryName != this.categoryName;
				this.query = query;
				this.categoryName = categoryName;
				if (update) {
					this.updateQueryTooLong();
					if (updateState)
						this.updateState();	
					this.update();
					var obj = {
						query: this.query,
						categoryName: this.categoryName
					};
					for (var listener of this.updateListeners) {
						listener(obj);
					}
				}
			}


			addUpdateListener(cb) {
				this.updateListeners.push(cb);
			}


			removeUpdateListener(cb) {
				let i = this.updateListeners.indexOf(cb);
				if (i >= 0)
					this.updateListeners.splice(i, 1);
			}


			setFromUrl() {
				this.fromState(this.stateObjFromUrl());
			}


			stateObjFromUrl() {
				if (!location.search) return null;
				let s = location.search.substring(1);
				if (!s) return null;
				let parts = {};
				s.split("&")
					.map(str => str.indexOf("=") >= 0 ? str.split("=", 2) : null)
					.forEach(part => parts[part[0]] = decodeURIComponent(part[1]));
				return {
					query: parts.q,
					categoryName: parts.cat
				};
			}


			update() {
				if (!dataProvider.all || !dataProvider.items)
					return; // not yet initialized	
				if (!this.categoryName && (!this.query || this.queryTooLong)) {
					this.results = [];
				} else if (!this.categoryName) { // filter by query only
					if (this.query === "*")
						this.results = dataProvider.all;
					else
						this.results = this.filterArray(dataProvider.all);
				} else if (!this.query || this.queryTooLong || this.query === "*") { // filter by category only
					this.results = dataProvider.items[this.categoryName];
				} else { // filter by category and query
					this.results = this.filterArray(dataProvider.items[this.categoryName]);
				}
			}


			/**
			 * @param {DataItem[]}
			 */
			filterArray(array) {
				let fuse = new Fuse(array, this.fuseOptions);
				return fuse.search(this.query);
			}


			isEmpty() {
				return this.results.length === 0;
			}


			isInitialized() {
				return !!(this.query || this.catName);
			}


		};
	}
}