/**
 * Created by jazalizil on 07/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .directive('mbCalendar', mbCalendarDirective);

  function mbCalendarDirective() {
    /** @ngInject */
    function mbCalendarController(CalendarService, _, $scope, $window, $log) {
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

      $scope.$watch(function(){
        return vm.data.currentMonth;
      }, function(newVal){
        if (typeof newVal !== 'undefined') {
          vm.data.daysToDisplay = getDaysToPrint();
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

      function getDaysToPrint() {
        var nbrDays = CalendarService.getNumberDaysOfMonth(vm.data.currentMonth, vm.data.currentYear);
        var firstDay = CalendarService.getFirstDayOfMonth(vm.data.currentMonth, vm.data.currentYear);
        var days = [], i, dayOfWeek = 1, len;
        if (firstDay !== 1) {
          var nbrDaysInPreviousMonth = vm.data.currentMonth === 0 ?
            CalendarService.getNumberDaysOfMonth(12, vm.data.currentYear - 1) :
            CalendarService.getNumberDaysOfMonth(vm.data.currentMonth, vm.data.currentYear);
          for(i=nbrDaysInPreviousMonth - firstDay + 2; i <= nbrDaysInPreviousMonth; i++, dayOfWeek++) {
            days.push({
              day: dayOfWeek,
              date: i,
              text: vm.data.daysDisplayed[dayOfWeek - 1].shortName
            });
          }
        } else if (vm.data.daysToDisplay && vm.data.daysToDisplay[vm.data.daysToDisplay.length - 1].daysLeft === 7) {
          for (i=7; i > 0; i--, dayOfWeek++) {
            if (dayOfWeek === 7) {
              dayOfWeek = 0;
            }
            days.push({
              day: dayOfWeek,
              date: vm.data.daysToDisplay[vm.data.daysToDisplay.length - 1].date + 8 - i,
              text: dayOfWeek === 0 ?
                vm.data.daysDisplayed[6].shortName :
                vm.data.daysDisplayed[dayOfWeek - 1].shortName
            })
          }
        }
        len = days.length;
        for(i=1; i <= 28 - len; i++, dayOfWeek++) {
          if (dayOfWeek === 7) {
            dayOfWeek = 0;
          }
          days.push({
            day: dayOfWeek,
            date: i,
            text: dayOfWeek === 0 ?
              vm.data.daysDisplayed[6].shortName :
              vm.data.daysDisplayed[dayOfWeek - 1].shortName,
            daysLeft: nbrDays - i
          });
        }
        return days;
      }

      vm.selectYear = function(year, skipDays) {
        year = +year;
        vm.data.yearsDisplayed = _.range(year - 1, year + 5);
        vm.data.currentYear = year;
        if (!skipDays) {
          vm.data.daysToDisplay = getDaysToPrint();
        }
      };

      vm.selectMonth = function(monthNumber) {
        if (monthNumber === -1) {
          vm.selectYear(vm.data.currentYear - 1, true);
          vm.data.currentMonth = 11;
        } else if (monthNumber === 12) {
          vm.selectYear(vm.data.currentYear + 1, true);
          vm.data.currentMonth = 0;
        } else {
          vm.data.currentMonth = monthNumber;
        }
      };

      vm.selectDay = function(day) {
        vm.data.realDate = {
          day: day,
          month: vm.data.currentMonth,
          year: vm.data.currentYear
        }
      }
    }

    return {
      restrict: 'E',
      controller: mbCalendarController,
      controllerAs: 'calendar',
      templateUrl: 'app/components/common/mbCalendar/mb-calendar.tpl.html',
      bindToController: true
    }
  }
})();