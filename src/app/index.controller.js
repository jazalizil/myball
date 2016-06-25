/**
 * Created by jazalizil on 09/12/15.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('AppController', AppController);

  /** @ngInject */
  function AppController(UserService, $scope) {
    var vm = this;
    vm.data = {
      isAuthenticated: UserService.isAuthenticated()
    };
    $scope.$on('loading', function(ev, loading){
      vm.data.isLoading = loading;
    });
  }
})();