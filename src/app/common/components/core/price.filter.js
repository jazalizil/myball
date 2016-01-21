/**
 * Created by jazalizil on 11/12/15.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .filter('price', priceFilter);
  /** @ngInject */
  function priceFilter() {
    return function(input) {
      return input + "€";
    }
  }
})();