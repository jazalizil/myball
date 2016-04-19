/**
 * Created by jazalizil on 18/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('MatchesController', MatchesController);
  /** @ngInject */
  function MatchesController(UserService, MatchesService, _, $scope, $mdSidenav, gettextCatalog) {
    var vm = this;
    vm.data = {
      identity: angular.copy(UserService.getIdentity()),
      placeholders: {
        paid: gettextCatalog.getString('Payé'),
        name: gettextCatalog.getString('Nom complet'),
        phone: gettextCatalog.getString('Numéro de téléphone')
      },
      today: {
        realDate: new Date()
      },
      statusToColor : {
        waiting: 'bg-yellow',
        ready: 'bg-red',
        over: 'bg-green',
        free: 'bg-grey'
      },
      startFrom: 0,
      limitTo: 6,
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
      else if (oldVal.year && oldVal.year !== newVal.year) {
        vm.data.today.realDate.setFullYear(+newVal.year);
        fetchMatches(+newVal);
      }
      getHours();
    }, true);

    vm.openSidenav = function(hour, field) {
      vm.data.match = null;
      vm.data.selectedHour = angular.copy(hour);
      vm.data.match = hour.matches[field._id] || {
          maxPlayers: vm.data.teamSizes[0].value,
          createdWith: 'myBall',
          responsable: {},
          field: field._id,
          startDate: new Date(vm.data.today.year, vm.data.today.month, vm.data.today.date, Math.floor(vm.data.selectedHour.value)),
          endDate: new Date(vm.data.today.year, vm.data.today.month, vm.data.today.date, Math.floor(vm.data.selectedHour.value) + 1)
        };
      if (vm.data.selectedHour.value * 10 % 10 !== 0) {
        vm.data.selectedHour.value = Math.floor(vm.data.selectedHour.value);
        vm.data.selectedHour.isHalf = true;
        if (!vm.data.match.createdDate) {
          vm.data.match.startDate.setMinutes(30);
          vm.data.match.endDate.setMinutes(30);
        }
      }
      $mdSidenav('right')
        .toggle()
    };

    var getHours = function(){
      var toPush, hours = _.range(9, 26, 0.5);
      vm.data.hours = [];
      _.each(hours, function(hour){
        toPush = {
          value: hour,
          slots: {},
          matches: {},
          status: 'free'
        };
        _.each(vm.data.today.matches, function(match){
          if (match.startDate.getHours() !== hour ||
            (match.startDate.getMinutes() === 30 && match.startDate.getHours() !== Math.floor(hour))) {
            return;
          }
          toPush.matches[match.field] = match;
        });
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