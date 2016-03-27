/**
 * Created by jazalizil on 14/12/15.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .directive('phonePrexix', PhonePrefix);
  /** @ngInject */
  function PhonePrefix() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, el, attrs, controller) {
        function ensurePhonePrefix(value){
          if (!value) return value;
          if ('+33'.indexOf(value) === 0 || '0033'.indexOf(value) === 0) return value;
          if (value.indexOf('0033') === 0 || value.indexOf('+33') === 0) return value;

          controller.$setViewValue('+33' + value);
          controller.$render();
          return '+33' + value;
        }
        controller.$formatters.push(ensurePhonePrefix);
        controller.$parsers.push(ensurePhonePrefix);
      }
    }
  }
})();