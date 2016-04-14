/**
 * Created by jazalizil on 18/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('MatchesController', MatchesController);
  /** @ngInject */
  function MatchesController(UserService, gettextCatalog, MatchesService, _, $scope, $location, $anchorScroll, $log) {
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
      vm.data.selectedHour = hour;
      scrollTo(hour.value);
      if (!_.isEmpty(hour.slots)) {
        var firstMatch = Object.keys(hour.slots)[0];
        var field = _.find(vm.data.fields, function(field){
          return field._id === hour.slots[firstMatch][0].field
        });
        vm.selectField(field);
      } else {
        vm.selectField(vm.data.fields[0]);
      }
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
      scrollTo(field._id);
    };

    function scrollTo(id) {
      $location.hash(id);
      $anchorScroll();
    }

    var getHours = function(){
      var toPush, hours = _.range(24), count = 0, field;
      vm.data.hours = [];
      _.each(hours, function(hour){
        toPush = {
          value: hour,
          slots: {},
          status: 'free',
          available: hour > 8 && hour < 23
        };
        _.each(vm.data.today.matches, function(match){
          if (match.startDate.getHours() !== hour) {
            return;
          }
          if (match.status === 'ready') {
            field = _.find(vm.data.fields, function(field){
              return field._id === match.field;
            });
            field.booked = true;
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
        if (vm.data.today.realDate.getHours() === hour) {
          vm.selectHour(toPush)
        }
        vm.data.hours.push(toPush);
      });
    };

    var init = function() {
      vm.data.fields = vm.data.identity.five.fields;
      fetchMatches();
    };
    init();
  }
})();