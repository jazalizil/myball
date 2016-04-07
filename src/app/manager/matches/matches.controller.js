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
      selectFieldPlaceholder: gettextCatalog.getString("Aucun terrain"),
      hours: _.range(24),
      date: new Date()
    };
    vm.data.selectedField = vm.data.identity.five.fields[0];
    $log.debug(vm.data.hours);

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
    };
    init();
  }
})();