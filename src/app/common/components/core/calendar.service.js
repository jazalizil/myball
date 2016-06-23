/**
 * Created by jazalizil on 07/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .factory('CalendarService', CalendarService);
  /** @ngInject */
  function CalendarService(gettextCatalog) {
    return {
      getNumberDaysOfMonth: function(month, year) {
        return new Date(year, month, 0).getDate();
      },
      getFirstDayOfMonth : function(month, year) {
        return new Date(year, month, 1).getDay();
      },
      getWeekOfYear: function(date) {
        var onejan = new Date(date.getFullYear(),0,1);
        var millisecsInDay = 86400000;
        return Math.ceil((((date - onejan) /millisecsInDay) + onejan.getDay()+1)/7);
      },
      getDuration: function(startD, endD) {
        var start = new Date(startD);
        var end = new Date(endD);
        var diff = (end - start); // milliseconds between start & end
        return {
          days: Math.round(diff / 86400000),
          hours: Math.round((diff % 86400000) / 3600000) - 1,
          mins: Math.round(((diff % 86400000) % 3600000) / 60000)
        }
      },
      getHourOffset : function() {
        var today = new Date();
        var offset = today.getTimezoneOffset() / 60;
        var base = -2, val, ret;
        if (base > offset) {
          val = base - offset;
          ret = {
            fig : '-',
            text : val % 10 === 0 ? '0' + val : val,
            value: offset - base
          }
        } else {
          val = offset - base;
          ret = {
            fig : '+',
            text : val % 10 === 0 ? '0' + val : val,
            value : base - offset
          }
        }
        if (ret.value * 10 % 10 === 0) {
          ret.text += ':00';
        } else {
          ret.text += ':30';
        }
        return ret;
      },
      getDatas : function() {
        return {
          date : new Date(),
          daysDisplayed : [
            {
              number : 0,
              name : gettextCatalog.getString('Dimanche'),
              shortName : gettextCatalog.getString('Dim')
            },
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