/**
 * Created by jazalizil on 16/12/15.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .factory('_', lodashFactory);
  /** @ngInject */
  function lodashFactory($window) {
    // place lodash include before angular
    return $window._;
  }
})();