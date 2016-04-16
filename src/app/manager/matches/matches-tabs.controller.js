/**
 * Created by jazalizil on 16/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('MatchesTabController', MatchesTabController);
  /** @ngInject */
  function MatchesTabController(UserService, $scope, MatchesService, _) {
    var vm = this;
    vm.data = {
      identity: angular.copy(UserService.getIdentity()),
      today: {
        realDate: new Date()
      },
      statusToColor : {
        waiting: 'bg-yellow',
        ready: 'bg-red',
        over: 'bg-green',
        free: 'bg-grey'
      },
      teamSizes: [
        {
          value: 10,
          name: '5 vs 5'
        },
        {
          value: 6,
          name: '3 vs 3'
        }
      ]
    };

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

    vm.selectHour = function(hour) {
      vm.data.selectedHour = hour;
    };

    vm.selectField = function(field) {
      vm.data.selectedField = field;
      vm.data.match = _.find(vm.data.today.matches, function(match){
        return match.field === field._id && match.startDate.getHours() === vm.data.selectedHour.value
      });
      if (!vm.data.match) {
        vm.data.match = {
          maxPlayers: vm.data.teamSizes[0].value,
          responsable: {},
          field: field._id,
          startDate: new Date(vm.data.today.year, vm.data.today.month, vm.data.today.date, vm.data.selectedHour.value),
          endDate: new Date(vm.data.today.year, vm.data.today.month, vm.data.today.date, vm.data.selectedHour.value + 1)
        };
      }
    };

    vm.goToTab = function(index, hour) {
      vm.data.selectedTabIndex = index;
      if (hour) {
        vm.data.selectedHour = hour;
      }
    };

    var getHours = function(){
      var toPush, hours = _.range(24);
      vm.data.hours = [];
      _.each(hours, function(hour){
        toPush = {
          value: hour,
          slots: {},
          matches: [],
          status: 'free',
          available: hour > 8 && hour < 23
        };
        _.each(vm.data.today.matches, function(match){
          if (match.startDate.getHours() !== hour) {
            return;
          }
          toPush.matches.push(match);
        });
        if (vm.data.today.realDate.getHours() === hour) {
          vm.selectHour(toPush)
        }
        vm.data.hours.push(toPush);
      });
    };

    var fetchMatches = function(y) {
      var params = {}, year = y || vm.data.today.realDate.getFullYear();
      params.startDate = new Date(year, 0, 15);
      params.endDate = new Date(year, 12, 31);
      MatchesService.fetchMatches(vm.data.identity, params)
        .then(function(res){
          vm.data.allMatches = res;
        });
    };

    var init = function() {
      vm.data.fields = vm.data.identity.five.fields;
      fetchMatches();
    };
    init();
  }
})();