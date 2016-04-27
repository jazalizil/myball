(function(){
  'use strict';
  angular.module('myBall').controller('SigninController', SigninController);

  /** @ngInject */
  function SigninController(AuthorizationService, $log, $state, toastr, gettextCatalog, Conf, $scope) {
    var vm = this;
    vm.datas = {
      isLoading: false,
      placeholders: {
        email: gettextCatalog.getString("Addresse email"),
        password: gettextCatalog.getString("Mot de passe")
      },
      bgUrl: Conf.CDN_BASE_URL + 'images/field-factory.jpg'
    };
    
    vm.login = function() {
      vm.datas.isLoading = true;
      AuthorizationService.login(vm.datas.login, vm.datas.password).then(function() {
        $state.go('main');
        vm.datas.isLoading = false;
      }, function(err) {
        if (err.data && err.data.code === 404) {
          toastr.error(gettextCatalog.getString("Cet utilisateur n'existe pas"), gettextCatalog.getString('Erreur'));
          $scope.signinForm.$setValidity('email', false);
        }
        else if (err.data && err.data.code === 403) {
          toastr.error(gettextCatalog.getString("Le mot de passe est invalide"), gettextCatalog.getString('Erreur'));
          $scope.signinForm.$setValidity('password', false);
        }
        else {
          toastr.error(gettextCatalog.getString('Impossible de joindre le serveur. Veuillez réessayer ultérieurement'),
            gettextCatalog.getString('Erreur'));
        }
        vm.datas.isLoading = false;
        $log.debug(err);
      });
    };
    vm.forgot = function() {
      vm.data.isLoading = true;
      return AuthorizationService.forgot()
    }
  }
})();