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