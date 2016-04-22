(function(){
  'use strict';
  angular.module('myBall').controller('StartController', StartController);

  /** @ngInject */
  function StartController(UserService, $state, $log) {
    var init;
    init = function() {
      return UserService.identity().then((function(data) {
        $log.debug('Go to home');
        $log.debug(data);
        $state.go('home');
      }), function() {
        $log.debug('Login required');
        $state.go('home');
      });
    };
    $log.debug('startCtrl');
    init();
  }
})();