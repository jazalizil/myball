/**
 * Created by jazalizil on 06/03/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .service('MatchesService', MatchesService);
  /** @ngInject */
  function MatchesService(Restangular, UserService, moment){
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
        return Restangular.one('matches').post('manager', match);
      },
      patch: function(payload) {
        return Restangular.one('matches', payload.match._id).patch(payload);
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
        var start = moment(match.startDate);
        var end = moment(match.endDate);
        match.startDate = {
          year: start.year(),
          month: start.month(),
          date: start.date(),
          day: start.weekday(),
          hours: start.hours(),
          minutes: start.minutes()
        };
        match.endDate = {
          year: end.year(),
          month: end.month(),
          date: end.date(),
          day: end.weekday(),
          hours: end.hours(),
          minutes: end.minutes()
        };
      },
      cleanDates: function(match) {
        var startDate = moment()
          .year(match.startDate.year)
          .month(match.startDate.month)
          .date(match.startDate.date)
          .hours(Math.floor(match.startDate.hours))
          .minutes(match.startDate.minutes);
        var endDate = moment(startDate)
          .date(match.endDate.date)
          .hours(Math.floor(match.endDate.hours))
          .minutes(match.endDate.minutes);
        return {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        };
        // return {
        //   startDate: match.startDate.year + '-' + z(match.startDate.month + 1) + '-' +
        //     z(match.startDate.date) + 'T' + z(startHour) + ':' +
        //     z(match.startDate.minutes) + ':' + z(match.startDate.seconds) + '.' + zz(match.startDate.milliseconds) +'Z',
        //   endDate: match.endDate.year + '-' + z(match.endDate.month + 1) + '-' +
        //     z(match.endDate.date) + 'T' + z(endHour) + ':' +
        //     z(match.endDate.minutes) + ':' + z(match.endDate.seconds) + '.' + zz(match.endDate.milliseconds) +'Z'
        // }
      },
      getDates: function(hour, slot) {
        var start = moment()
          .year(slot.year)
          .month(slot.month)
          .date(slot.date)
          .hours(hour.value)
          .minutes(hour.minutes);
        var end = moment(start).add(1, 'h');
        return {
          start: {
            year: start.year(),
            month: start.month(),
            date: start.date(),
            day: start.day(),
            hours: start.hours(),
            minutes: start.minutes()
          },
          end: {
            year: end.year(),
            month: end.month(),
            date: end.date(),
            day: end.day(),
            hours: end.hours(),
            minutes: end.minutes()
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
