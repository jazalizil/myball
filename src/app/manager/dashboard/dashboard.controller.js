/**
 * Created by jazalizil on 19/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('DashboardController', DashboardController);
  /** @ngInject */
  function DashboardController(UserService) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity()
    };
  }
})();