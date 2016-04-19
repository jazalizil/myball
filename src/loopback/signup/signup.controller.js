(function(){
  'use strict';
  angular.module('myBall').controller('SignupController', SignupController);

  /** @ngInject */
  function SignupController(AuthorizationService, toastr, $mdDialog, $state, $log, _, $q, Upload, gettextCatalog) {
    var vm = this;
    vm.data = {
      allowedCountries: [
        gettextCatalog.getString('France')
      ],
      tooltip: gettextCatalog.getString('Ajouter un terrain'),
      five: {},
      manager: {},
      fields: []
    };

    vm.verifySiren = function(form) {
      var figure, size=0, sum=0;
      if (vm.data.five.siren != null) {
        size = vm.data.five.siren.length;
      }
      if (size !== 9) {
        form.fiveSiren.$setValidity('invalidSiren', false);
        return;
      }
      while (size > 0) {
        figure = Number(vm.data.five.siren[size - 1]);
        if (figure % 2 === 0) {
          sum += figure * 2;
        } else {
          sum += figure;
        }
        size--;
      }
      if (sum % 10 === 0) {
        form.fiveSiren.$setValidity('invalidSiren', true);
      }
      form.fiveSiren.$setValidity('invalidSiren', false);
    };

    vm.verifyPwdConfirmation = function(form) {
      if (vm.data.manager.password === vm.data.manager.passwordConf) {
        form.managerPasswordConf.$setValidity('invalid', true);
      }
      form.managerPasswordConf.$setValidity('invalid', false);
    };

    function cleanDatas() {
      var deferred = $q.defer();
      var cleanedDatas;
      vm.data.five.gps = vm.data.completeAddress.geometry.coordinates;
      vm.data.five.address = vm.data.completeAddress.properties.name;
      cleanedDatas = angular.copy(_.pick(vm.data, function(value, key){
        return key === 'manager' || key === 'five' || key === 'fields';
      }));
      if (!vm.data.five.photo) {
        deferred.resolve(cleanedDatas);
      }
      else {
        Upload.dataUrl(vm.data.five.photo, true).then(function(url){
          cleanedDatas.five.photo = url;
          deferred.resolve(cleanedDatas);
        });
      }
      return deferred.promise;
    }

    vm.register = function(form) {
      if (!form.$valid) {
        form.submitted = true;
        toastr.error(gettextCatalog.getString('Informations incorrectes'), gettextCatalog.getString('Erreur'));
      }
      else if (_.isEmpty(vm.data.fields)){
        form.submitted = true;
        toastr.error(gettextCatalog.getString('Veuillez ajouter au moins un terrain'),
          gettextCatalog.getString('Erreur'));
      }
      else {
        vm.data.isLoading = true;
        cleanDatas().then(function(toSend){
          AuthorizationService.register(toSend).then(function(res) {
            vm.data.isLoading = false;
            $log.debug('registration successful');
            $log.debug(res);
            $state.go('fields');
          }, function(err) {
            $log.debug(err);
            vm.data.isLoading = false;
            toastr.error(gettextCatalog.getString('Impossible de joindre le serveur. Veuillez réessayer ultérieurement'),
              gettextCatalog.getString('Erreur'));
          });
        });
      }
    };

    vm.addField = function() {
      $mdDialog.show({
        clickOutsideToClose: true,
        templateUrl: 'app/manager/fields/field-edit.tpl.html',
        controller: 'FieldEditController',
        controllerAs: 'vm',
        bindToController: true
      }).then(function(field){
        vm.data.fields.push(field);
      });
    };
    vm.data.five.country = vm.data.allowedCountries[0];
  }
})();