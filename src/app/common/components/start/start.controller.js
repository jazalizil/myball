(function(){
  'use strict';
  angular.module('myBall').controller('StartController', StartController);

  /** @ngInject */
  function StartController($state, $log, UserService, AuthorizationService) {
    $log.debug('startCtrl');
    UserService.identity(true).then(function(){
      $state.go('main');
    }, function(){
      AuthorizationService.logout();
    })
  }
})();