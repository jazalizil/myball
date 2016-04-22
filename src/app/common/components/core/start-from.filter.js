/**
 * Created by jazalizil on 11/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .filter('startFrom', startFromFilter);
  /** @ngInject */
  function startFromFilter() {
    return function(input, start) {
      if(input) {
        start = +start; //parse to int
        return input.slice(start);
      }
      return [];
    }
  }
})();