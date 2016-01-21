/**
 * Created by jazalizil on 10/12/15.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .directive('mbBarButton', mbBarButton);
  /** @ngInject */
  function mbBarButton() {
    return {
      templateUrl: 'app/common/components/mbBarButton/mbBarButton.tpl.html',
      scope: {
        icon: '@',
        action: '&',
        tooltip: '@'
      }
    }
  }
})();