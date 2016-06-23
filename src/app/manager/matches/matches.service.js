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
    function z(n){ return (n < 10? '0' : '') + n }
    function zz(n){ return (n < 100 ? '0' + z(n) : z(n)); }
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
      initDates: function(match) {
        var start = new Date(match.startDate);
        var end = new Date(match.endDate);
        start.setUTCHours(start.getUTCHours());
        match.startDate = {
          year: start.getUTCFullYear(),
          month: start.getUTCMonth(),
          date: start.getUTCDate(),
          day: start.getDay(),
          hours: start.getUTCHours(),
          minutes: start.getUTCMinutes(),
          seconds: start.getUTCSeconds(),
          milliseconds: start.getUTCMilliseconds()
        };
        end.setUTCHours(end.getUTCHours());
        match.endDate = {
          year: end.getUTCFullYear(),
          month: end.getUTCMonth(),
          date: end.getUTCDate(),
          day: end.getDay(),
          hours: end.getUTCHours(),
          minutes: end.getUTCMinutes(),
          seconds: end.getUTCSeconds(),
          milliseconds: end.getUTCMilliseconds()
        };
      },
      cleanDates: function(match) {
        var startHour = Math.floor(match.startDate.hours);
        var endHour = Math.floor(match.endDate.hours);
        var endMinutes = match.duration * 10 % 10 === 0 && match.startDate.minutes === 0 ? 0 : 30;
        return {
          startDate: match.startDate.year + '-' + z(match.startDate.month) + '-' +
            z(match.startDate.date) + 'T' + z(startHour) + ':' +
            z(match.startDate.minutes) + ':' + z(match.startDate.seconds) + '.' + zz(match.startDate.milliseconds) +'Z',
          endDate: match.endDate.year + '-' + z(match.endDate.month) + '-' +
            z(match.endDate.date) + 'T' + z(endHour) + ':' +
            z(endMinutes) + ':' + z(match.endDate.seconds) + '.' + zz(match.endDate.milliseconds) +'Z'
        }
      },
      getDates: function(hour) {
        var today = new Date();
        return {
          start: {
            year: today.getUTCFullYear(),
            month: today.getUTCMonth() + 1,
            date: today.getUTCDate(),
            day: today.getDay(),
            hours: hour.value,
            minutes: hour.minutes,
            seconds: today.getUTCSeconds(),
            milliseconds: today.getUTCMilliseconds()
          },
          end: {
            year: today.getUTCFullYear(),
            month: today.getUTCMonth() + 1,
            date: today.getUTCDate(),
            day: today.getDay(),
            hours: hour.value + 1,
            minutes: hour.minutes,
            seconds: today.getUTCSeconds(),
            milliseconds: today.getUTCMilliseconds()
          }
        }
      },
      setDuration: function(match) {
        var duration = match.endDate.hours - match.startDate.hours;
        var minuteDiff = match.endDate.minutes - match.startDate.minutes;
        if (minuteDiff != 0) {
          duration += minuteDiff > 0 ? 0.5 : -0.5;
        }
        match.duration = duration;
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