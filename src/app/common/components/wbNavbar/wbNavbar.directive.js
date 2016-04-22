/**
 * Created by jazalizil on 21/01/2016.
 */

(function () {
	'use strict';
	angular.module('myBall')
			.directive('wbNavbar', wbNavbar);
	/** @ngInject */
	function wbNavbar() {
		return {
			restrict: 'E',
			templateUrl: 'app/common/components/wbNavbar/wbNavbar.tpl.html',
			scope: {
				opaq : '@'
			}
		};
	}
})();