/**
 * Created by jazalizil on 11/12/15.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .filter('hour', hourFilter);
  /** @ngInject */
  function hourFilter() {
    return function(input) {
      if (input == "24") {
        return "00h";
      }
      return input + "h";
    }
  }
})();