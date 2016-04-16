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
		vm.goState = goState;
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

		function goState(state) {
			$state.go(state);
		}

		function logout() {
			AuthorizationService.logout();
		}
	}
})();