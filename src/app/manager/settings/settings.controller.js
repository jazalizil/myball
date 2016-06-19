/**
 * Created by jazalizil on 15/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('SettingsController', SettingsController);
  /** @ngInject */
  function SettingsController(UserService, gettextCatalog, _, $log, FiveService) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity(),
      labels: {
        manager: gettextCatalog.getString('Manager'),
        five: gettextCatalog.getString('Five'),
        field: gettextCatalog.getString('Terrains'),
        email: gettextCatalog.getString('Adresse mail'),
        oldPassword: gettextCatalog.getString('Ancien mot de passe'),
        newPassword: gettextCatalog.getString('Nouveau mot de passe'),
        phone: gettextCatalog.getString('Numéro de téléphone'),
        fiveName: gettextCatalog.getString('Nom du five'),
        fieldName: gettextCatalog.getString('Nom du terrain'),
        available: gettextCatalog.getString('Disponible')
      },
      sentences: [
        gettextCatalog.getString('Modifier vos informations personnelles.'),
        gettextCatalog.getString('Modifier les informations de votre five.'),
        gettextCatalog.getString('Modifier les informations de vos terrains.')
      ],
      photo: {},
      fieldIndex: 0
    };

    vm.previousField = function() {
      if (vm.data.fieldIndex !== 0) {
        vm.data.fieldIndex -= 1;
      }
    };
    vm.nextField = function() {
      if (vm.data.fieldIndex !== vm.data.identity.five.fields.length - 1) {
        vm.data.fieldIndex += 1;
      }
    };
    vm.update = function() {
      var toSend = _.omitBy(_.pick(vm.data.newIdentity.five, ['photo', 'phone', 'name']), function(val, key){
        return vm.data.identity.five[key] === val;
      });
      vm.data.isLoading = true;
      FiveService.update(toSend).then(function(res){
        vm.data.isLoading = false;
        vm.data.identity.five = res;
        UserService.setIdentity(vm.data.newIdentity);
        vm.data.identity.photo = vm.data.newIdentity.photo;
        $log.debug(res);
      }, function(){
        vm.data.isLoading = false;
      });
    };
    var init = function () {
      vm.data.welcomeSentence = gettextCatalog.getString('Bonjour') + ' ' + vm.data.identity.manager.firstName;
      vm.data.newIdentity = _.cloneDeep(vm.data.identity);
      $log.debug(vm.data.newIdentity);
    };
    init();
  }
})();