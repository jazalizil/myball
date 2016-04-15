/**
 * Created by jazalizil on 15/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('SettingsController', SettingsController);
  /** @ngInject */
  function SettingsController(UserService, gettextCatalog, $log, $document) {
    var vm = this;
    vm.data = {
      identity: angular.copy(UserService.getIdentity()),
      labels: {
        manager: gettextCatalog.getString('Manager'),
        five: gettextCatalog.getString('Five'),
        field: gettextCatalog.getString('Field'),
        email: gettextCatalog.getString('Email adress'),
        oldPassword: gettextCatalog.getString('Old password'),
        newPassword: gettextCatalog.getString('New password'),
        phone: gettextCatalog.getString('Phone number'),
        fiveName: gettextCatalog.getString('Five name'),
        fieldName: gettextCatalog.getString('Field name'),
        available: gettextCatalog.getString('Available')
      },
      fieldIndex: 0
    };

    vm.data.welcomeSentence = gettextCatalog.getString('Hello') + ' ' + vm.data.identity.manager.firstName;
    vm.editCity = function() {
      var cityEl = angular.element($document[0].getElementById('city'));
      cityEl.focus();
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
    }
  }
})();