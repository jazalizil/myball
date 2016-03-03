/**
 * Created by jazalizil on 07/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .factory('CalendarService', CalendarService);
  /** @ngInject */
  function CalendarService(gettextCatalog, _) {
    return {
      getNumberDaysOfMonth: function(month, year) {
        return new Date(year, month, 0).getDate();
      },
      getFirstDayOfMonth : function(month, year) {
        return new Date(year, month, 1).getDay();
      },
      getDaysToPrint: function(data) {
        var nbrDays = this.getNumberDaysOfMonth(data.currentMonth, data.currentYear);
        var firstDay = this.getFirstDayOfMonth(data.currentMonth, data.currentYear);
        var days = [], i, dayThread = 1, len, toPush;
        if (firstDay !== 1) {
          var nbrDaysInPreviousMonth = data.currentMonth === 0 ?
            this.getNumberDaysOfMonth(12, data.currentYear - 1) :
            this.getNumberDaysOfMonth(data.currentMonth, data.currentYear);
          for(i=nbrDaysInPreviousMonth - firstDay + 2; i <= nbrDaysInPreviousMonth; i++, dayThread++) {
            toPush = {
              day: dayThread,
              date: i,
              text: data.daysDisplayed[dayThread - 1].shortName,
              matches: []
            };
            _.each(data.matches, function(match) {
              var d = new Date(data.currentYear, data.currentMonth, dayThread);
              if (match.startDate === d.toJSON()) {
                toPush.matches.push(match);
              }
            });
            days.push(toPush);
          }
        }
        else if (data.daysToDisplay && data.daysToDisplay[data.daysToDisplay.length - 1].daysLeft === 7) {
          for (i=7; i > 0; i--, dayThread++) {
            if (dayThread === 7) {
              dayThread = 0;
            }
            toPush = {
              day: dayThread,
              date: data.daysToDisplay[data.daysToDisplay.length - 1].date + 8 - i,
              text: dayThread === 0 ?
                data.daysDisplayed[6].shortName :
                data.daysDisplayed[dayThread - 1].shortName,
              matches: []
            };
            _.each(data.matches, function(match) {
              var d = new Date(data.currentYear, data.currentMonth, dayThread);
              if (match.startDate === d.toJSON()) {
                toPush.matches.push(match);
              }
            });
            days.push(toPush);
          }
        }
        len = days.length;
        for(i=1; i <= 28 - len; i++, dayThread++) {
          if (dayThread === 7) {
            dayThread = 0;
          }
          toPush = {
            day: dayThread,
            date: i,
            text: dayThread === 0 ?
              data.daysDisplayed[6].shortName :
              data.daysDisplayed[dayThread - 1].shortName,
            daysLeft: nbrDays - i,
            matches: []
          };
          _.each(data.matches, function(match) {
            var d = new Date(data.currentYear, data.currentMonth, dayThread);
            if (match.startDate === d.toJSON()) {
              toPush.matches.push(match);
            }
          });
          days.push(toPush);
        }
        return days;
      },
      getDatas : function() {
        return {
          date : new Date(),
          daysDisplayed : [
            {
              number : 1,
              name : gettextCatalog.getString('Lundi'),
              shortName : gettextCatalog.getString('Lun')
            },
            {
              number : 2,
              name : gettextCatalog.getString('Mardi'),
              shortName : gettextCatalog.getString('Mar')
            },
            {
              number : 3,
              name : gettextCatalog.getString('Mercredi'),
              shortName : gettextCatalog.getString('Mer')
            },
            {
              number : 4,
              name : gettextCatalog.getString('Jeudi'),
              shortName : gettextCatalog.getString('Jeu')
            },
            {
              number : 5,
              name : gettextCatalog.getString('Vendredi'),
              shortName : gettextCatalog.getString('Ven')
            },
            {
              number : 6,
              name : gettextCatalog.getString('Samedi'),
              shortName : gettextCatalog.getString('Sam')
            },
            {
              number : 0,
              name : gettextCatalog.getString('Dimanche'),
              shortName : gettextCatalog.getString('Dim')
            }
          ],
          monthsDisplayed : [
            {
              number : 0,
              name : gettextCatalog.getString('Janvier'),
              shortName : gettextCatalog.getString('Jan')
            },
            {
              number : 1,
              name : gettextCatalog.getString('Février'),
              shortName : gettextCatalog.getString('Fev')
            },
            {
              number : 2,
              name : gettextCatalog.getString('Mars'),
              shortName : gettextCatalog.getString('Mar')
            },
            {
              number : 3,
              name : gettextCatalog.getString('Avril'),
              shortName : gettextCatalog.getString('Avr')
            },
            {
              number : 4,
              name : gettextCatalog.getString('Mai'),
              shortName : gettextCatalog.getString('Mai')
            },
            {
              number : 5,
              name : gettextCatalog.getString('Juin'),
              shortName : gettextCatalog.getString('Jun')
            },
            {
              number : 6,
              name : gettextCatalog.getString('Juillet'),
              shortName : gettextCatalog.getString('Jui')
            },
            {
              number : 7,
              name : gettextCatalog.getString('Août'),
              shortName : gettextCatalog.getString('Aou')
            },
            {
              number : 8,
              name : gettextCatalog.getString('Septembre'),
              shortName : gettextCatalog.getString('Sep')
            },
            {
              number : 9,
              name : gettextCatalog.getString('Octobre'),
              shortName : gettextCatalog.getString('Oct')
            },
            {
              number : 10,
              name : gettextCatalog.getString('Novembre'),
              shortName : gettextCatalog.getString('Nov')
            },
            {
              number : 11,
              name : gettextCatalog.getString('Décembre'),
              shortName : gettextCatalog.getString('Dec')
            }
          ]
        }
      }
    }
  }
})();