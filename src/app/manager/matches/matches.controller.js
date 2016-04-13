/**
 * Created by jazalizil on 18/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('MatchesController', MatchesController);
  /** @ngInject */
  function MatchesController(UserService, gettextCatalog, MatchesService, _, $scope, $location, $anchorScroll) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity(),
      placeholders: {
        paid: gettextCatalog.getString('Paid'),
        name: gettextCatalog.getString('Complete Name'),
        phone: gettextCatalog.getString('Phone Number')
      },
      hours: [],
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
      },
      statusToColor : {
        waiting: 'bg-yellow',
        ready: 'bg-red',
        over: 'bg-green',
        free: 'bg-grey'
      }
    };
    vm.data.selectedField = vm.data.identity.five.fields[0];

    $scope.$watch(function(){
      return vm.data.today
    }, function(newVal, oldVal){
      if (!newVal) {
        return;
      }
      else if (oldVal.year !== newVal.year) {
        vm.data.today.realDate.setFullYear(+newVal.year);
        fetchMatches(+newVal);
      }
      getHours();
    }, true);

    var fetchMatches = function(y) {
      var params = {}, year = y || vm.data.today.realDate.getFullYear();
      params.startDate = new Date(year, 0, 15);
      params.endDate = new Date(year, 12, 31);
      MatchesService.fetchMatches(vm.data.identity, params)
        .then(function(res){
          vm.data.allMatches = res;
        });
    };

    vm.selectHour = function(hour) {
      if (hour.available) {
        vm.data.selectedHour = hour;
      }
    };

    var getHours = function(){
      var toPush, hours = _.range(24), count = 0;
      vm.data.hours = [];
      _.each(hours, function(hour){
        toPush = {
          value: hour,
          slots: {},
          status: 'free',
          available: true
        };
        if (vm.data.today.realDate.getHours() === hour) {
          vm.data.selectedHour = toPush;
          $location.hash(hour);
          $anchorScroll();
        }
        _.each(vm.data.today.matches, function(match){
          if (match.startDate.getHours() !== hour) {
            return;
          }
          if (vm.data.statusToColor[match.status]) {
            if (!toPush.slots[match.status]) {
              toPush.slots[match.status] = [];
              toPush.status = match.status;
            }
            toPush.slots[match.status].push(match);
            count += 1;
          }
        });
        if (count >= vm.data.identity.five.fields.length) {
          toPush.available = false;
        }
        vm.data.hours.push(toPush);
      });
    };

    var init = function() {
      fetchMatches();
      vm.data.match.maxPlayers = vm.data.teamSizes[0].value;
    };
    init();
  }
})();