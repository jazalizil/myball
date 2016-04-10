/**
 * Created by jazalizil on 18/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('MatchesController', MatchesController);
  /** @ngInject */
  function MatchesController(UserService, gettextCatalog, MatchesService, $log, _) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity(),
      placeholders: {
        paid: gettextCatalog.getString('Paid'),
        name: gettextCatalog.getString('Complete Name'),
        phone: gettextCatalog.getString('Phone Number')
      },
      hours: _.range(24),
      date: new Date(),
      teamSizes: [
        {
          value: 10,
          name: '5 vs 5'
        },
        {
          value: 6,
          name: '3 vs 3'
        }
      ],
      match: {}
    };
    vm.data.selectedField = vm.data.identity.five.fields[0];

    var init = function() {
      var params = {};
      params.startDate = vm.data.date;
      params.endDate = new Date();
      params.startDate.setMonth(params.startDate.getMonth());
      params.endDate.setMonth(params.endDate.getMonth() + 6);
      MatchesService.fetchMatches(vm.data.identity, params)
        .then(function(res){
          vm.data.matches = res;
          $log.debug(res);
        });
      vm.data.match.maxPlayers = vm.data.teamSizes[0].value;
    };
    init();
  }
})();