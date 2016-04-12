/**
 * Created by jazalizil on 18/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('MatchesController', MatchesController);
  /** @ngInject */
  function MatchesController(UserService, gettextCatalog, MatchesService, $log, _, $scope) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity(),
      placeholders: {
        paid: gettextCatalog.getString('Paid'),
        name: gettextCatalog.getString('Complete Name'),
        phone: gettextCatalog.getString('Phone Number')
      },
      hours: _.range(24),
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
      match: {},
      today: {
        realDate: new Date()
      }
    };
    vm.data.selectedField = vm.data.identity.five.fields[0];

    $scope.$watch(function(){
      return vm.data.today.year
    }, function(newVal){
      if (newVal && +newVal !== +vm.data.today.realDate.getFullYear()) {
        vm.data.today.realDate.setFullYear(+newVal);
        fetchMatches(+newVal);
      }
    });

    function fetchMatches(y) {
      var params = {}, year = y || vm.data.today.realDate.getFullYear();
      params.startDate = new Date(year, 0, 15);
      params.endDate = new Date(year, 12, 31);
      MatchesService.fetchMatches(vm.data.identity, params)
        .then(function(res){
          vm.data.allMatches = res;
        });
    }

    vm.isMatchAt = function(hour){
      return _.find(vm.data.today.matches, function(match){
        return match.startDate.getHours() === hour;
      })
    };

    var init = function() {
      fetchMatches();
      vm.data.match.maxPlayers = vm.data.teamSizes[0].value;
    };
    init();
  }
})();