/**
 * Created by jazalizil on 06/03/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .service('MatchesService', MatchesService);
  /** @ngInject */
  function MatchesService(Restangular){
    return {
      fetchMatches : function(identity, params) {
        return Restangular.all('matches/five')
          .get(identity.five._id, {
            startDate: params.startDate.toJSON(),
            endDate: params.endDate.toJSON(),
            sort: 'startDate'
          });
      }
    }
  }
})();