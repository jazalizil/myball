(function(){
	'use strict';
	angular.module('myBall').controller('ProfilController', ProfilController);

	/** @ngInject */
	function ProfilController($log, UserService) {
		var vm = this;

		getIdentity();

		$log.debug('profilCtrl');
		vm.selectedTab = 'resume';

		vm.selectTab = function(tab) {
			vm.selectedTab = tab;
		};

		vm.isSelected = function(tab) {
			return tab === vm.selectedTab;
		};

		function getIdentity() {
			/* API CALL */
			vm.me = UserService.getIdentity();

			/* EN DUR */
			/*vm.me = {
				"_id": "56ccd52f1da82f966e74aa52",
				"username": "thyrz",
				"email": "elias@weball.fr",
				"firstName": "Thierry",
				"lastName": "Nguyen",
				"fullName": "Thierry Nguyen",
				"matchs": [
					"56cdbd46dfe726f87cf84947",
					"56cdbd51dfe726f87cf8494e",
					"56cdbd5edfe726f87cf84955",
					"56cdbd67dfe726f87cf8495c",
					"56cefd8acac04d897e23860e"
				],
				"relationShip": {
					"nFollowers": 54,
					"nFollowing": 23,
					"following": false
				},
				"nMatches": {
					"win": 20,
					"loose": 20,
					"nul": 20,
					"total": 60
				},
				"stats": {
					"attack": 90,
					"fairplay": 65,
					"defense": 48,
					"nVotes": 42
				}
			};*/

			//Pas touchay
			getStats();
		}

		function getStats() {
			vm.historyWinPercent = (vm.me.nMatches.total > 0) ? Math.round((vm.me.nMatches.win * 100) / vm.me.nMatches.total) : 0;
			vm.historyLoosePercent = (vm.me.nMatches.total > 0) ? Math.round((vm.me.nMatches.loose * 100) / vm.me.nMatches.total) : 0;
			vm.historyNulPercent = (vm.me.nMatches.total > 0) ? Math.round((vm.me.nMatches.nul * 100) / vm.me.nMatches.total) : 0;

			/* A retourner par l'API */
			vm.me.relationShip.nVotes = 34;
		}
	}
})();