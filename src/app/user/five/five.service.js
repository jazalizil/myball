/**
 * Created by jazalizil on 26/06/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .factory('FiveService', FiveService);
  /** @ngInject */
  function FiveService(Restangular){
    return {
      getFives: function(lat, lgt) {
        return Restangular.one('five').get({lat: lat, lgt: lgt}).then(function(five) {
          return five;
        });
      }
    }
  }
})();