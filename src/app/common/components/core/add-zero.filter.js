/**
 * Created by jazalizil on 23/06/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .filter('addZero', addZeroFilter);
  /** @ngInject */
  function addZeroFilter() {
    return function(input) {
      if (+input < 10) {
        return '0' + input;
      }
      return input;
    }
  }
})();