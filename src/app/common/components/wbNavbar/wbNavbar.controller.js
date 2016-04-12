(function(){
	'use strict';
	angular
			.module('myBall')
			.controller('WbNavbarController', WbNavbarController);

	/** @ngInject */
	function WbNavbarController(UserService, AuthorizationService, $state) {
		var vm = this;

		vm.isAuthed = isAuthed;
		vm.getFullName = getFullName;
		vm.goProfil = goProfil;
		vm.logout = logout;

		function isAuthed() {
			return UserService.isAuthenticated();
		}

		function getFullName() {
			if (vm.isAuthed) {
				var identity = UserService.getIdentity();
				if (identity) { return identity.fullName; }
				return null;
			}
		}

		function goProfil() {
			$state.go('profil');
		}

		function logout() {
			AuthorizationService.logout();
		}
	}
})();