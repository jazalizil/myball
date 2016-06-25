(function(){
	'use strict';
	angular.module('myBall').controller('FiveController', FiveController);

	/** @ngInject */
	function FiveController(FiveService, $scope, $mdDialog, $log) {
		var vm = this;
		
		vm.data = {
			googleMapsUrl: 'http://maps.google.com/maps/api/js?key=AIzaSyCfjHRsNqjRFqOzFhxyruh3HAHkW3S-ScU'
		};

		vm.selectedSite = null;
		vm.showSites = showSites;
		vm.showInformations = showInformations;
		loadFives();

		function loadFives() {
			FiveService.getFives(48.864716, 2.349014).then(function(fives) {
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
				$log.debug(markers);
				vm.customIcon = {
					// "scaledSize": [40, 60],
					"url": "/assets/icons/myball.svg"
				};
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