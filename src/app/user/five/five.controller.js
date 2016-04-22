(function(){
	'use strict';
	angular.module('myBall').controller('FiveController', FiveController);

	/** @ngInject */
	function FiveController(UserService, $scope, $mdDialog) {
		var vm = this;

		vm.selectedSite = null;
		vm.showSites = showSites;
		vm.showInformations = showInformations;
		loadFives();

		function loadFives() {
			UserService.getFives(48.864716, 2.349014).then(function(fives) {
				var markers = [];
				for (var key in fives) {
					if (isNaN(key)) {
						break;
					}
					markers[key] = {
						title: fives[key].name,
						position: [fives[key].gps[1], fives[key].gps[0]]
					};
				}
				vm.markers = markers;
			});
		}

		function showSites(evt, index) {
			vm.selectedSite = vm.markers[index];
			$scope.showInfoWindow.apply(vm, [evt, 'bar-info-window']);
		}

		function showInformations(ev, title) {
			$mdDialog.show(
					$mdDialog.alert()
							/*.parent(angular.element(document.querySelector('#popupContainer')))*/
							.clickOutsideToClose(true)
							.title(title)
							.textContent('Five proche de chez vous')
							/*.targetEvent(ev)*/
							.ariaLabel('Five description')
							.ok('OK')
			);
		}
	}
})();