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

      // Watches
      var w = angular.element($window);
      $scope.$watch(function () {
        return $window.innerWidth;
      }, function (newVal) {
        if (newVal < 1390 && newVal >= 1050) {
          vm.data.nbWeeks = _.range(3);
        }
        else if (newVal < 1050 && newVal > 750) {
          vm.data.nbWeeks = _.range(2);
        } else if (newVal >= 1390) {
          vm.data.nbWeeks = _.range(4);
        } else {
          vm.data.nbWeeks = _.range(1);
        }
      });
      w.bind('resize', function () {
        $scope.$apply();
      });

      $scope.$watch(function() {
        return vm.data.currentYear
      }, function(newVal){
        vm.date = new Date(newVal, vm.data.currentMonth, vm.data.currentDay);
      });
      $scope.$watch(function(){
        return vm.data.currentMonth
      }, function(newVal){
        vm.date = new Date(vm.data.currentYear, newVal, vm.data.currentDay);
      });
      $scope.$watch(function(){
        return vm.data.currentDay
      }, function(newVal){
        vm.date = new Date(vm.data.currentYear, vm.data.currentMonth, newVal);
      });

      function getDaysOfLastDecember(days) {
        var index = 0, date, emptyDays = 0;
        while (_.isEmpty(days[index])) {
          emptyDays++;
          index++;
        }
        date = 31 - emptyDays + 1;
        index = 0;
        while (index < emptyDays) {
          days[index] = {
            date: date,
            month: 11,
            year: vm.data.currentYear - 1,
            text: vm.data.daysDisplayed[index+1].shortName
          };
          index++;
          date++;
        }
        return days;
      }

      function getDaysOfNextJanuary(days) {
        var start, dayOfWeek, date = 1;
        start = days[days.length - 1].day;
        dayOfWeek = days[days.length - 1].day + 1;
        while (start < 7) {
          if (dayOfWeek === 7) {
            dayOfWeek = 0;
          }
          days.push({
            date: date,
            month: 0,
            year: vm.data.currentYear + 1,
            text: vm.data.daysDisplayed[dayOfWeek].shortName
          });
          date++;
          dayOfWeek++;
          start++;
        }
        return days;
      }

      function fillDaysWithOtherYears(days) {
        if (_.isEmpty(days[0])) {
          days = getDaysOfLastDecember(days);
        }
        if (days[days.length - 1].day !== 0) {
          days = getDaysOfNextJanuary(days);
        }
        return days;
      }

      function getDaysToDisplay() {
        var days = [], nbrDays, firstDay, dayOfWeek, j, i;
        firstDay = CalendarService.getFirstDayOfMonth(0, vm.data.currentYear);
        j = firstDay;
        while (j > 1){
          days.push({});
          j--;
        }
        for (i = 0; i < 12; i++) {
          nbrDays = CalendarService.getNumberDaysOfMonth(i+1, vm.data.currentYear);
          firstDay = CalendarService.getFirstDayOfMonth(i, vm.data.currentYear);
          dayOfWeek = firstDay;
          for (j = 1; j <= nbrDays; j++) {
            if (dayOfWeek == 7){
              dayOfWeek = 0;
            }
            days.push({
              day: dayOfWeek,
              date: j,
              year: vm.data.currentYear,
              month: i,
              text: vm.data.daysDisplayed[dayOfWeek].shortName
            });
            dayOfWeek++;
          }
        }
        return fillDaysWithOtherYears(days);
      }

      function getFirstWeekIndex() {
        var i = 7;
        while (vm.data.daysToDisplay[i].month !== vm.data.currentMonth) {
          i += 7;
        }
        return vm.data.daysToDisplay[i].date === 1 ? i : i - 7;
      }

      vm.selectYear = function (year) {
        year = +year;
        vm.data.yearsDisplayed = _.range(year - 1, year + 5);
        vm.data.currentYear = year;
        vm.data.daysToDisplay = getDaysToDisplay();
      };

      vm.selectMonth = function (monthIndex) {
        vm.data.currentMonth = monthIndex;
        vm.data.weekIndex = getFirstWeekIndex();
      };

      vm.selectDay = function (day) {
        vm.data.realDate = {
          day: day.date,
          month: day.month,
          year: day.year
        };
        vm.data.currentDay = day.date;
        vm.data.currentMonth = day.month;
        if (day.year !== vm.data.currentYear) {
          vm.selectYear(day.year);
        }
        $log.debug(day);
      };

      function checkAnotherMonth() {
        if (vm.data.daysToDisplay[vm.data.weekIndex+7].month !== vm.data.currentMonth) {
          vm.data.currentMonth = vm.data.daysToDisplay[vm.data.weekIndex+7].month;
        }
      }
      
      vm.previousDays = function() {
        vm.data.weekIndex -= 7;
        if (vm.data.weekIndex < 0) {
          vm.selectYear(vm.data.currentYear - 1);
        }
        checkAnotherMonth();
      };
      
      vm.nextDays = function() {
        vm.data.weekIndex += 7;
        if (vm.data.weekIndex > vm.data.daysToDisplay.length) {
          vm.selectYear(vm.data.currentYear + 1);
        }
        checkAnotherMonth();
      };

      function init() {
        vm.data.daysToDisplay = getDaysToDisplay();
        vm.data.weekIndex = getFirstWeekIndex();
      }

      init();
      $log.debug('matches :', vm.matches);
    }
        

    return {
      restrict: 'E',
      controller: mbCalendarController,
      controllerAs: 'calendar',
      templateUrl: 'app/common/components/mbCalendar/mb-calendar.tpl.html',
      bindToController: true,
      scope: {
        matches : '=',
        date: '='
      }
    }
  }
})();