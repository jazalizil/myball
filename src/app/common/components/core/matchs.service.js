/**
 * Created by jazalizil on 01/03/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .service('MatchService', MatchService);
  /** @ngInject */
  function MatchService(Restangular, UserService) {
    var identity = UserService.getIdentity();
    return {
      fetch : function(sort, startDate, endDate) {
        return Restangular.all('/matches/five')
          .get(identity.five._id, {
            sort: 'startDate',
            startDate: startDate.toJSON(),
            endDate: endDate.toJSON()
          });
      }
  }

  }
})();