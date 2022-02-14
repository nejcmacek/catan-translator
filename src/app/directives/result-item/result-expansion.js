{
	'use strict';

	angular
		.module('ct')
		.factory('ResultExpansion', ResultExpansion);

	function ResultExpansion($http, $q) {
		return new class {


			token;


			set(obj) {
				if (this.token && this.token.hide)
					this.token.hide();
				this.token = obj;
			}


			remove() {
				this.token = null;
			}


			clear() {
				if (this.token && this.token.hide)
					this.token.hide();
				this.token = null;
			}


		};
	}
}