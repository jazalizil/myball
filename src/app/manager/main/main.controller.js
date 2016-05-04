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
        img: Conf.CDN_BASE_URL + "images/footsalle-field.png"
      },
      slots: [],
      calendar: CalendarService.getDatas(),
      statuses: {
        in_progress: {
          class: 'yellow',
          text: gettextCatalog.getString('Match en cours')
        },
        available: {
          class: 'green',
          text: gettextCatalog.getString('Disponible')
        },
        over: {
          class: 'blue',
          text: gettextCatalog.getString('Terminé')
        }
      }
    };

    var getFieldStatus = function(field) {
      var endDate, startDate, now;
      if (!field.matches) {
        field.status = 'available';
        return;
      }
      _.each(field.matches, function(match){
        startDate = new Date(match.startDate);
        endDate = new Date(match.endDate);
        now = new Date(vm.data.calendar.date.toJSON());
        startDate = startDate.getTime();
        endDate = endDate.getTime();
        now.setHours(vm.data.slots[vm.data.slotIndex].hour);
        now = now.getTime();
        if (endDate > now && startDate < now && now === vm.data.calendar.date.getTime()) {
          field.status = 'in_progress';
        }
        else if (endDate < now && field.status !== 'in_progress') {
          field.status = 'available';
        }
        else {
          field.status = 'over';
        }
      });
    };

    vm.refreshFields = function() {
      _.each(vm.data.fieldsChunked, function(fields) {
        _.each(fields, function(field){
          if (vm.data.slots[vm.data.slotIndex].matches[field._id]) {
            field.matches = vm.data.slots[vm.data.slotIndex].matches[field._id];
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
            hour: slotTime,
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
        if (vm.data.calendar.date.getMinutes() === 30 && vm.data.calendar.date.getSeconds() === 0) {
          _.each(vm.data.fieldsChunked, function(fields){
            _.each(fields, getFieldStatus);
          })        
        }
      }, 1000);
    };
    init();
  }
})();