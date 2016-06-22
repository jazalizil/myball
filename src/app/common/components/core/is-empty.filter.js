/**
 * Created by jazalizil on 14/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .filter('isEmpty', isEmpty);
  /** @ngInject */
  function isEmpty(_) {
    return function(input) {
      return _.isEmpty(input);
    }
  }
})();