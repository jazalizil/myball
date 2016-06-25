(function(){
  'use strict';
  angular.module('myBall').controller('SigninController', SigninController);

  /** @ngInject */
  function SigninController(AuthorizationService, $log, $state, toastr, gettextCatalog) {
    var vm = this;
    vm.datas = {
      isLoading: false,
      placeholders: {
        email: gettextCatalog.getString("Adresse email"),
        password: gettextCatalog.getString("Mot de passe"),
        remember: gettextCatalog.getString("Se souvenir de moi")
      },
      remember: true
    };
    
    vm.login = function() {
      if (!vm.datas.login || !vm.datas.password) {
        toastr.error(gettextCatalog.getString('Mauvaises informations'), gettextCatalog.getString('Erreur'));
        return;
      }
      vm.datas.isLoading = true;
      AuthorizationService.login(vm.datas.login, vm.datas.password, vm.datas.remember).then(function() {
        $state.go('profil');
        vm.datas.isLoading = false;
      }, function(err) {
        if (err.data && err.data.code === 404) {
          toastr.error(gettextCatalog.getString('Cet utilisateur n\'existe pas'), gettextCatalog.getString('Erreur'));
          vm.signinForm.$setValidity('email', false);
        }
        else if (err.data && err.data.code === 403) {
          toastr.error(gettextCatalog.getString('Le mot de passe est invalide'), gettextCatalog.getString('Erreur'));
          vm.signinForm.$setValidity('password', false);
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