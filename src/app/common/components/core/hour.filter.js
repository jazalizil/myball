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
      if (+input === 24) {
        input = "00h";
      }
      else if (+input * 10 % 10 !== 0) {
        input = Math.ceil(+input) + "h30"
      }
      else {
        input += "h";
      }
      return input;
    }
  }
})();