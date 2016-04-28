/**
 * Created by jazalizil on 21/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .factory('CryptoJs', CryptoJs);
  /** @ngInject */
  function CryptoJs($window){
    return $window.CryptoJS;
  }
})();