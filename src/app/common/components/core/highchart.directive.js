/**
 * Created by jazalizil on 19/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .directive('highchart', HighChartsDirective);
  /** @ngInject */
  function HighChartsDirective(Highcharts) {
    return {
      restrict: 'E',
      template: '<div></div>',
      scope: {
        options: '='
      },
      link: function(scope, element) {
        Highcharts.chart(element[0], scope.options);
      }
    }
  }
})();