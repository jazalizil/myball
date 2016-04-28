/**
 * Created by jazalizil on 28/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .factory('FiveService', FiveService);
  /** @ngInject */
  function FiveService(Restangular) {
    return {
      update: function(five) {
        return Restangular.one('five', 'me').patch(five);
      }
    }
  }
})();