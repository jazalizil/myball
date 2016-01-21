(function(){
  'use strict';
  angular.module('myBall').factory('OpenDataRestangular', OpenDataRestangular);

  /** @ngInject */
  function OpenDataRestangular(Restangular, Conf) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(Conf.OPENDATA_API_BASE_URL);
      RestangularConfigurer.setDefaultHeaders({
        'x-access-token': void 0
      });
    });
  }
})();