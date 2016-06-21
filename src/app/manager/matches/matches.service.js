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
      },
      fetchToday : function() {
        var date = new Date(), today, tomorrow;
        date.setHours(0);
        today = date.toJSON();
        date.setHours(23);
        tomorrow = date.toJSON();
        return Restangular.all('matches/five')
          .get(_identity.five._id, {
            startDate : today,
            endDate: tomorrow,
            sort: 'startDate'
          });
      },
      setStatus : function(match) {
        //  status  :      ready if match.maxPlayers == match.currentPlayers ;
        //                 waiting else if match.maxPlayers != match.currentPlayers;
        //                 over if match.endDate < currentDate;
        //                 free else
        var today = new Date();
        match.teams = match.teams.length ? match.teams : [{},{}];
        var matchDate = new Date(match.endDate);
        if (matchDate.getTime() < today.getTime()) {
          match.status = 'over';
          match.teams[0].status = 'over';
          match.teams[1].status = 'over';
        }
        else if (match.maxPlayers !== match.currentPlayers) {
          match.status = 'waiting';
          match.teams[0].status = match.teams[0].users && match.teams[0].users.length === match.maxPlayers / 2 ?
            'ready' : 'waiting';
          match.teams[1].status = match.teams[1].users && match.teams[1].users.length === match.maxPlayers / 2 ?
            'ready' : 'waiting';
        }
        else {
          match.status = 'ready';
          match.teams[0].status = 'ready';
          match.teams[1].status = 'ready';
        }
      },
      delete : function(id) {
        return Restangular.one('matches', id).remove();
      }
    }
  }
})();