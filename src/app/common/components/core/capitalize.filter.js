(function(){
  'use strict';
  angular.module('myBall').filter('capitalize', capitalize);

  /** @ngInject */
  function capitalize() {
    return function(input) {
      if (input) {
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
      }
    };
  }
})();