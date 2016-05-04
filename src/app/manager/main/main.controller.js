(function(){
  'use strict';
  angular.module('myBall')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($log, UserService, Conf, MatchesService, $scope, CalendarService, $interval, _, gettextCatalog) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity(),
      content: {
        img: Conf.CDN_BASE_URL + "images/footsalle-field.png",
      },
      slots: [],
      calendar: CalendarService.getDatas(),
      statuses: {
        in_progress: {
          class: 'yellow',
          text: gettextCatalog.getString('match en cours')
        },
        available: {
          class: 'green',
          text: gettextCatalog.getString('disponible')
        },
        over: {
          class: 'blue',
          text: gettextCatalog.getString('terminé')
        }
      }
    };

    var getFieldStatus = function(field) {
      var endDate, startDate, now;
      if (!field.match) {
        field.status = 'available';
        return;
      }
      startDate = new Date(field.match.startDate);
      endDate = new Date(field.match.endDate);
      startDate = startDate.getTime();
      endDate = endDate.getTime();
      now = vm.data.calendar.date.getTime();
      if (endDate > now && startDate < now) {
        field.status = 'in_progress';
      }
      else if (endDate < now) {
        field.status = 'available';
      }
      else {
        field.status = 'over';
      }
    };

    vm.refreshFields = function() {
      _.each(vm.data.fieldsChunked, function(fields) {
        _.each(fields, function(field){
          if (vm.data.slots[vm.data.slotIndex].matches[field._id]) {
            field.match = vm.data.slots[vm.data.slotIndex].matches[field._id][0];
          }
          getFieldStatus(field);
          $log.debug('status', vm.data.statuses[field.status]);
        })
      });
      $log.debug('fields', vm.data.fieldsChunked, '\n' +
        'slotIndex', vm.data.slotIndex + '\n' +
        'slots', vm.data.slots);
    };

    var init = function() {
      var rangeHours = _.range(9, 23, 2);
      MatchesService.fetchToday().then(function(matches){
        matches.push();
        vm.data.matches = matches;
        vm.data.slotIndex = 0;
        _.each(rangeHours, function(slotTime){
          if (slotTime === vm.data.calendar.date.getHours() || slotTime + 1 === vm.data.calendar.date.getHours()) {
            vm.data.slotIndex = vm.data.slots.length;
          }
          vm.data.slots.push({
            text: slotTime + 'h - ' + (slotTime + 1) + 'h',
            matches: _.groupBy(_.filter(matches, function(match){
              var date = new Date(match.startDate);
              return date.getHours() == slotTime || date.getHours() == slotTime + 1;
            }), 'field')
          });
        });
        vm.data.fieldsChunked = _.chunk(vm.data.identity.five.fields, 3);
        vm.refreshFields();
        $scope.$emit('loading', false);
      });
      $scope.$emit('loading', true);
      $interval(function(){
        vm.data.calendar.date = new Date();
      }, 1000).then(function(){
        _.each(vm.data.fieldsChunked, function(fields){
          _.each(fields, getFieldStatus);
        })
      });
    };
    init();
  }
})();