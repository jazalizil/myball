/**
 * Created by jazalizil on 21/01/2016.
 */

(function () {
	'use strict';
	angular.module('myBall')
			.controller('RegisterController', RegisterController);
	/** @ngInject */
	function RegisterController(AuthorizationService, toastr, gettextCatalog, $state, $log) {
		var vm = this;

		/*vm.showForm = showForm;*/
		vm.goState = goState;

		vm.data = {
			isLoading: false
		};
/*		vm.manager = {
			submit: managerSubmit
		};*/
		vm.user = {
			submit: userSubmit
		};

		function goState(state) {
			$state.go(state);
		}

		/** Register **/
/*		function showForm(form) {
			vm.data.form = form;
		}*/

		/** Register manager **/
		/*function managerSubmit() {

		}*/

		/** Register user **/
		function userSubmit() {
			if (!vm.user.firstName || !vm.user.lastName || !vm.user.email ||
					!vm.user.password || !vm.user.passwordConf) {
				vm.error = "Mising fields";
			} else if (vm.user.password !== vm.user.passwordConf) {
				vm.error = "Passwords doesn't match";
			} else {
				var data = {
					'user': {
						fullName: vm.user.firstName + ' ' + vm.user.lastName,
						email: vm.user.email,
						password: vm.user.password
					}
				};

				vm.data.isLoading = true;
				return AuthorizationService.registerUser(data).then(function() {
					$log.debug("Redirect to profil");
					vm.data.isLoading = false;
					$state.go('profil');
				}, function(err) {
					if (err.data && err.data.code === 400) {
						toastr.error(gettextCatalog.getString("Nom d'utilisateur invalide"), gettextCatalog.getString('Erreur'));
					} else if (err.data && err.data.code === 500) {
						toastr.error(gettextCatalog.getString("Internal server error"), gettextCatalog.getString('Erreur'));
					} else {
						toastr.error(gettextCatalog.getString('Impossible de joindre le serveur. Veuillez réessayer ultérieurement'), gettextCatalog.getString('Erreur'));
					}
					vm.data.isLoading = false;
					$log.debug(err);
				});
			}
		}
	}
})();