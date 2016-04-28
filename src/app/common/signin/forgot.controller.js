/**
 * Created by jazalizil on 28/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('ForgotController', ForgotController);
  /** @ngInject */
  function ForgotController(toastr, AuthorizationService, gettextCatalog, $stateParams, Conf, $state, $scope, $log) {
    var vm = this;
    vm.data = {
      placeholders: {
        email: gettextCatalog.getString("Addresse email"),
        password: gettextCatalog.getString("Mot de passe"),
        passwordConfirmation: gettextCatalog.getString("Confirmation du mot de passe")
      },
      bgUrl: Conf.CDN_BASE_URL + 'images/field-factory.jpg'
    };
    vm.sendMail = function() {
      vm.data.isLoading = true;
      AuthorizationService.forgot(vm.data.email).then(function(){
        toastr.success(gettextCatalog.getString('Un email vous a été envoyé'));
        vm.forgotForm.$setValidity('email', true);
        vm.data.isLoading = false;
      }, function(){
        vm.forgotForm.$setValidity('email', false);
        toastr.error(gettextCatalog.getString('Adresse mail invalide'), gettextCatalog.getString('Erreur'));
        vm.data.isLoading = false;
      });
    };
    vm.resetPassword = function() {
      if (vm.data.password !== vm.data.passwordConfirmation) {
        toastr.error(gettextCatalog.getString('Les mots de passes ne correspondent pas'), gettextCatalog.getString('Erreur'));
        vm.resetForm.$setValidity('password', false);
        vm.resetForm.$setValidity('passwordConfirmation', false);
        return ;
      }
      vm.data.isLoading = true;
      AuthorizationService.reset($stateParams.token, vm.data.password).then(function(){
        toastr.success(gettextCatalog.getString('Mot de passe réinitialisé avec succès'));
        vm.data.isLoading = false;
        $state.go('signin');
      }, function(){
        toastr.error(gettextCatalog.getString('Veuillez réessayer ultérieurement'), gettextCatalog.getString('Serveur indisponible'));
        vm.data.isLoading = false;
      });
    };
    var init = function () {
      if (typeof $stateParams.token !== 'undefined' && $stateParams.token.length > 100) {
        vm.data.resetPassword = true;
      }
    };
    init();
  }
})();