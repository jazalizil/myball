/**
 * Created by jazalizil on 14/12/15.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .factory('FieldsService', FieldsService);
  /** @ngInject */
  function FieldsService(gettextCatalog, _) {
    return {
      getDatas : function() {
        return {
          selectDays : [{
            text : gettextCatalog.getString('Du lundi au samedi'),
            value : 'WORKING_DAYS'
          },
            {
              text: gettextCatalog.getString('Autre'),
              value : 'OTHER'
            }
          ],
          selectHours : [{
            text: gettextCatalog.getString('Tous les jours de 9h à 00h'),
            value: 'FULL_HOURS'
          },
            {
              text: gettextCatalog.getString('Autre'),
              value: 'OTHER'
            }
          ],
          hours: _.range(9, 24)
        }
      }

    }
  }
})();