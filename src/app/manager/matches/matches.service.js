/**
 * Created by jazalizil on 06/03/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .service('MatchesService', MatchesService);
  /** @ngInject */
  function MatchesService(Restangular, UserService, $log){
    var _identity = UserService.getIdentity();
    return {
      fetchAll : function(params) {
        return Restangular.all('matches/five')
          .get(_identity.five._id, {
            startDate: params.startDate.toJSON(),
            endDate: params.endDate.toJSON(),
            sort: 'startDate'
          });
      },
      put: function(match) {
        $log.debug(match);
        return Restangular.one('matches').post('manager', match);
      },
      statusToColor : {
        waiting: {
          background: 'bg-yellow',
          color: 'yellow'
        },
        ready: {
          background: 'bg-red',
          color: 'red'
        },
        over: {
          background: 'bg-green',
          color: 'green'
        },
        free: {
          background: 'bg-grey',
          color: 'grey'
        }
      }
    }
  }
})();