/**
 * Created by jazalizil on 07/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .directive('mbCalendar', mbCalendarDirective);

  function mbCalendarDirective() {
    /** @ngInject */
    function mbCalendarController(CalendarService, MatchService, _, $scope, $window, $log) {
      var vm = this;
      vm.data = CalendarService.getDatas();
      vm.data.currentYear = vm.data.date.getFullYear();
      vm.data.currentMonth = vm.data.date.getMonth();
      vm.data.currentDay = vm.data.date.getDate();
      vm.data.realDate = {
        day: vm.data.currentDay,
        month: vm.data.currentMonth,
        year: vm.data.currentYear
      };
      vm.data.yearsDisplayed = _.range(vm.data.currentYear, vm.data.currentYear + 6);
      vm.data.nbWeeks = _.range(4);
      vm.data.matches = {};
      vm.data.statusColors = {
        waiting : 'mb-color',
        ready : 'yellow'
      };
      vm.data.interval = 10;
      vm.data.switchMonthCount = 0;

      $scope.$watch(function(){
        return vm.data.switchMonthCount;
      }, function(newVal) {
        if (newVal < -vm.data.interval / 2 || newVal > vm.data.interval / 2) {
          fetchMatchs();
        }
      });

      var w = angular.element($window);
      $scope.$watch(function(){
        return $window.innerWidth;
      }, function(newVal){
        $log.debug(newVal);
        if (newVal < 1390 && newVal >= 1050) {
          vm.data.nbWeeks = _.range(3);
        }
        else if (newVal < 1050 && newVal > 750) {
          vm.data.nbWeeks = _.range(2);
        } else if(newVal >= 1390) {
          vm.data.nbWeeks = _.range(4);
        }
      });
      w.bind('resize', function(){
        $scope.$apply();
      });

      vm.selectYear = function(year, skipDays) {
        year = +year;
        vm.data.yearsDisplayed = _.range(year - 1, year + 5);
        vm.data.currentYear = year;
        if (!skipDays) {
          vm.data.daysToDisplay = CalendarService.getDaysToPrint(vm.data);
        }
        vm.data.date = new Date(vm.data.currentYear, vm.data.currentMonth, vm.data.currentDay);
      };

      vm.selectMonth = function(monthNumber) {
        if (monthNumber === -1) {
          vm.selectYear(vm.data.currentYear - 1, true);
          vm.data.switchMonthCount--;
          vm.data.currentMonth = 11;
        } else if (monthNumber === 12) {
          vm.selectYear(vm.data.currentYear + 1, true);
          vm.data.switchMonthCount++;
          vm.data.currentMonth = 0;
        } else {
          vm.data.switchMonthCount = monthNumber - vm.data.currentMonth;
          vm.data.currentMonth = monthNumber;
        }
        vm.data.date = new Date(vm.data.currentYear, vm.data.currentMonth, vm.data.currentDay);
      };

      vm.selectDay = function(day) {
        vm.data.currentDay = day;
        vm.data.realDate = {
          day: day,
          month: vm.data.currentMonth,
          year: vm.data.currentYear
        };
        vm.data.date = new Date(vm.data.currentYear, vm.data.currentMonth, vm.data.currentDay);
      };

      var fetchMatchs = function() {
        vm.data.isLoading = true;
        var startDate = new Date(vm.data.currentYear, vm.data.currentMonth - vm.data.interval / 2, vm.data.currentDay);
        var endDate = new Date(vm.data.currentYear, vm.data.currentMonth + vm.data.interval / 2, vm.data.currentDay);
        MatchService.fetch('startDate', startDate, endDate).then(function(res) {
          vm.data.matches = angular.copy(res);
          //vm.data.daysToDisplay = CalendarService.getDaysToPrint(vm.data);
          vm.data.isLoading = false;
        });
      };

      fetchMatchs();
    }

    return {
      restrict: 'E',
      controller: mbCalendarController,
      controllerAs: 'calendar',
      templateUrl: 'app/common/components/mbCalendar/mb-calendar.tpl.html',
      bindToController: true
    }
  }
})();