/**
 * Created by jazalizil on 25/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .directive('mdInputContainer', mdInputContainer);
  /** @ngInject */
  function mdInputContainer($timeout) {
    return function ($scope, element) {
      var ua = navigator.userAgent;
      if (ua.match(/chrome/i) && !ua.match(/edge/i)) {
        $timeout(function () {
          if (element[0].querySelector('input[type=password]:-webkit-autofill')) {
            element.addClass('md-input-has-value');
          }
        }, 25);
      }
    };
  }
})();