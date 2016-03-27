(function(){
	'use strict';
	angular.module('myBall').controller('SigninController', SigninController);

	/** @ngInject */
	function SigninController(AuthorizationService, $log, $state, toastr, gettextCatalog) {
		var vm = this;
		vm.datas = {
			isLoading: false,
			placeholders: {
				email: gettextCatalog.getString("Nom d'utilisateur"),
				password: gettextCatalog.getString("Mot de passe")
			}
		};
		vm.login = function() {
			vm.datas.isLoading = true;
			return AuthorizationService.login(vm.datas.login, vm.datas.password).then(function() {
				$state.go('home');
				vm.datas.isLoading = false;
			}, function(err) {
				if (err.data && err.data.code === 404) {
					toastr.error(gettextCatalog.getString("Cet utilisateur n'existe pas"), gettextCatalog.getString('Erreur'));
				}
				else if (err.data && err.data.code === 403) {
					toastr.error(gettextCatalog.getString("Le mot de passe est invalide"), gettextCatalog.getString('Erreur'));
				}
				else {
					toastr.error(gettextCatalog.getString('Impossible de joindre le serveur. Veuillez réessayer ultérieurement'),
							gettextCatalog.getString('Erreur'));
				}
				vm.datas.isLoading = false;
				$log.debug(err);
			});
		};
	}
})();