/**
 * Created by jazalizil on 19/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .factory('Highcharts', HighchartsFactory);
  /** @ngInject */
  function HighchartsFactory($window) {
    return $window.Highcharts;
  }
})();