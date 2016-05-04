(function(){
  'use strict';
  angular.module('myBall').controller('StartController', StartController);

  /** @ngInject */
  function StartController($state, $log) {
    $log.debug('startCtrl');
    $state.go('signin');
  }
})();