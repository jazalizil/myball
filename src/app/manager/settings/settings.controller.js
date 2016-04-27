/**
 * Created by jazalizil on 15/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('SettingsController', SettingsController);
  /** @ngInject */
  function SettingsController(UserService, gettextCatalog, $document, $log, _, AmazoneS3) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity(),
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
      photo: {},
      fieldIndex: 0
    };

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
    };
    vm.upload = function() {
      vm.data.isLoading = true;
      uploadPhoto();
    };

    var uploadPhoto = function () {
      var ext = vm.data.photo.name.split('.').pop();
      // vm.data.photo.name = vm.data.identity.five._id + '.' + ext;
      AmazoneS3.upload(vm.data.photo, 'images/fives/').then(function(res){
        vm.data.isLoading = false;
        $log.debug(res);
      }, function(){
        vm.data.isLoading = false;
      })
    };
    var init = function () {
      vm.data.photo.src = vm.data.identity.five.photo;
      vm.data.welcomeSentence = gettextCatalog.getString('Bonjour') + ' ' + vm.data.identity.manager.firstName;
      vm.data.newIdentity = _.cloneDeep(vm.data.identity);
    };
    init();
  }
})();