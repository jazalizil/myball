/**
 * Created by jazalizil on 10/12/15.
 */

(function() {
  'use strict';
  angular.module('myBall')
    .factory('GouvDataRestangular', GouvDataRestangular);
  /** @ngInject */
  function GouvDataRestangular(Restangular, Conf) {
    return Restangular.withConfig(function(RestangularConfigurer){
      RestangularConfigurer.setBaseUrl(Conf.GOUVDATA_API_BASE_URL);
      RestangularConfigurer.setDefaultHeaders({
        'x-access-token': void 0
      });
    })
  }
})();