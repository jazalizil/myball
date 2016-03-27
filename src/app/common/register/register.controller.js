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

		vm.showForm = showForm;

		vm.data = {};
		vm.manager = {
			submit: managerSubmit
		};
		vm.user = {
			submit: userSubmit
		};

		var date = new Date();
		var ageLimit = 12;
		vm.maxDate = new Date(date.getFullYear() - ageLimit, date.getMonth(), date.getDate());

		/** Register **/
		function showForm(form) {
			vm.data.form = form;
		}

		/** Register manager **/
		function managerSubmit() {

		}

		/** Register user **/
		function userSubmit() {
			if (!vm.user.firstName || !vm.user.lastName || !vm.user.email
					|| !vm.user.birthday || !vm.user.username || !vm.user.password || !vm.user.passwordConf) {
				return alert("Mising fields");
			}
			if (vm.user.password !== vm.user.passwordConf) {
				return alert("Passwords doesn't match");
			}

			var data = {
				'user': {
					firstName: vm.user.firstName,
					lastName: vm.user.lastName,
					email: vm.user.email,
					birthday: vm.user.birthday,
					username: vm.user.username,
					password: vm.user.password
				}
			};

			return AuthorizationService.registerUser(data).then(function() {
				$log.debug("Redirect to signin");
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
})();