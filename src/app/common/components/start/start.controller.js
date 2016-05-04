(function(){
  'use strict';
  angular.module('myBall').controller('StartController', StartController);

  /** @ngInject */
  function StartController($state, $log, UserService) {
    $log.debug('startCtrl');
    if (UserService.isIdentityResolved()) {
      $state.go('main');
    }
    else {
      $state.go('signin');
    }
  }
})();