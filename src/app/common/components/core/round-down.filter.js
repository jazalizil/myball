/**
 * Created by jazalizil on 23/06/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .filter('roundDown', roundDownFilter);
  /** @ngInject */
  function roundDownFilter() {
    return function(input) {
      return Math.floor(input);
    }
  }
})();