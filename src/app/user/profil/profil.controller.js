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
			$log.debug(vm.me);

			/* Valeurs en dur */
			vm.me._nMatches.total = 69;
			vm.me._nMatches.win = 33;
			vm.me._nMatches.nul = 20;
			vm.me._nMatches.loose = 16;
			vm.me._relationShip.nRelations = 42;

			/* Calcule les % */
			vm.me._nMatches.winPercent = Math.round((vm.me._nMatches.total * vm.me._nMatches.win) / 100);
			vm.me._nMatches.nulPercent = Math.round((vm.me._nMatches.total * vm.me._nMatches.nul) / 100);
			vm.me._nMatches.loosePercent = (vm.me._nMatches.total > 0) ? 100 - vm.me._nMatches.winPercent - vm.me._nMatches.nulPercent : 0;

			if (vm.me && vm.me.matchs) {
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