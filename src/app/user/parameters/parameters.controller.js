(function(){
	'use strict';
	angular.module('myBall').controller('ParametersController', ParametersController);

	/** @ngInject */
	function ParametersController($log, UserService, toastr, gettextCatalog) {
		var vm = this;

		vm.error = null;
		vm.isLoading = false;
		vm.selectedTab = 'informations';
		vm.selectTab = selectTab;
		vm.isSelected = isSelected;
		vm.submit = submit;
		initiate();

		function initiate() {
			var Identity = UserService.getIdentity();

			vm.me = Identity;
			vm.user = JSON.parse(JSON.stringify(Identity));
			var parsedFullName = Identity.fullName.split(" ");
			vm.user.firstName = parsedFullName[0];
			vm.user.lastName = parsedFullName[1];
		}

		function selectTab(tab) {
			vm.selectedTab = tab;
		}

		function isSelected(tab) {
			return tab === vm.selectedTab;
		}

		function submit() {
			if (!vm.user.firstName || !vm.user.lastName || !vm.user.email) {
				vm.error = 'Please fill all required fields';
			} else {
				vm.isLoading = true;
				var data = {
					'user': {
						fullName: vm.user.firstName + ' ' + vm.user.lastName,
						email: vm.user.email,
						birthday: vm.user.birthday,
						city: vm.user.city
					}
				};
				return UserService.update('users', data).then(function(user) {
					$log.debug("Then :", user);
					vm.isLoading = false;
				}, function(err) {
					if (err.data && err.data.code === 404) {
						toastr.error(gettextCatalog.getString("Cet utilisateur n'existe pas"), gettextCatalog.getString('Erreur'));
					}
					else if (err.data && err.data.code === 400) {
						toastr.error(gettextCatalog.getString("Champs invalides"), gettextCatalog.getString('Erreur'));
					}
					else {
						toastr.error(gettextCatalog.getString('Impossible de joindre le serveur. Veuillez réessayer ultérieurement'),
								gettextCatalog.getString('Erreur'));
					}
					vm.isLoading = false;
					$log.debug("Err : ", err);
				});
			}
		}
	}
})();