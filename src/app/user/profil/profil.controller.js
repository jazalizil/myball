(function(){
	'use strict';
	angular.module('myBall').controller('ProfilController', ProfilController);

	/** @ngInject */
	function ProfilController($log, UserService) {
		var vm = this;

		$log.debug('profilCtrl');

		vm.selectedTab = 'resume';
		vm.selectTab = selectTab;
		vm.isSelected = isSelected;
		vm.incomingMatches = [];

		initiate();

		function selectTab(tab) {
			vm.selectedTab = tab;
		}

		function isSelected(tab) {
			return tab === vm.selectedTab;
		}

		function initiate() {
			vm.me = UserService.getIdentity();
			if (vm.me.matchs) {
				getNextThreeIncoming();
			}
		}

		function getNextThreeIncoming() {
			var compt = 0;
			for (var i in vm.me.matchs) {
				if (vm.me.matchs[i]) {
					vm.incomingMatches.push(vm.me.matchs[i]);
					compt += 1;
				}

				if (compt === 3) {
					break;
				}
			}
		}
	}
})();