/**
 * Created by jazalizil on 18/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall').controller('MatchsController', MatchsController);
  /** @ngInject */
  function MatchsController(UserService, gettextCatalog) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity(),
      selectFieldPlaceholder: gettextCatalog.getString("Aucun terrain")
    };
    vm.data.selectedField = vm.data.identity.five.fields[0];
  }
})();