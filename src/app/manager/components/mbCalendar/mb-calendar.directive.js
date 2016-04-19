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
      vm.data.matchStatusToColor = {
        waiting: 'bg-yellow',
        ready: 'bg-red',
        over: 'bg-green'
      };

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

      $scope.$watch(function(){
        return vm.matches
      }, function(newVal){
        if (newVal) {
          $log.debug('matches:', vm.matches);
          addMatchesToDays();
        }
      });

      function addMatchesToDays() {
        var date, toPush;
        _.each(vm.data.daysToDisplay, function(day){
          day.matches = [];
          _.each(vm.matches, function(match) {
            date = new Date(match.startDate);
            if(date.getFullYear() === day.year && date.getMonth() === day.month && date.getDate() === day.date) {
              toPush = match;
              toPush.startDate = new Date(match.startDate);
              toPush.endDate = new Date(match.endDate);
              toPush.createdAt = new Date(match.createdAt);
              day.matches.push(toPush);
            }
          })
        })
      }

      function getDaysOfLastDecember(days) {
        var index = 0, date, emptyDays = 0, dayOfWeek = vm.data.daysDisplayed[0].day - 1;
        while (_.isEmpty(days[index])) {
          emptyDays++;
          index++;
        }
        date = 31 - emptyDays + 1;
        index = 0;
        while (index < emptyDays) {
          days[index] = {
            day: dayOfWeek,
            date: date,
            month: 11,
            year: vm.data.currentYear - 1,
            text: vm.data.daysDisplayed[index+1].shortName,
            name: vm.data.daysDisplayed[index+1].name,
            monthName: vm.data.monthsDisplayed[11].name
          };
          index++;
          date++;
          dayOfWeek--;
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
            day: dayOfWeek,
            date: date,
            month: 0,
            year: vm.data.currentYear + 1,
            text: vm.data.daysDisplayed[dayOfWeek].shortName,
            name: vm.data.daysDisplayed[dayOfWeek].name,
            monthName: vm.data.monthsDisplayed[0].name
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
              text: vm.data.daysDisplayed[dayOfWeek].shortName,
              name: vm.data.daysDisplayed[dayOfWeek].name,
              monthName: vm.data.monthsDisplayed[i].name
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
        vm.today.year = year;
      };

      vm.selectMonth = function (monthIndex) {
        vm.data.currentMonth = monthIndex;
        vm.data.weekIndex = getFirstWeekIndex();
      };

      vm.selectDay = function (day) {
        var realDate = vm.today.realDate;
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
        vm.today = day;
        vm.today.realDate = realDate;
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
        var realDate = vm.today.realDate;
        vm.data.daysToDisplay = getDaysToDisplay();
        vm.data.weekIndex = getFirstWeekIndex();
        var day = _.filter(vm.data.daysToDisplay, function(day){
          return day.year === vm.today.realDate.getFullYear() &&
            day.month === vm.today.realDate.getMonth() &&
              day.date === vm.today.realDate.getDate()
        });
        vm.today = day[0];
        vm.today.realDate = realDate;
        $log.debug('day:', day[0]);
      }
      init();
    }

    return {
      restrict: 'E',
      controller: mbCalendarController,
      controllerAs: 'calendar',
      templateUrl: 'app/manager/components/mbCalendar/mb-calendar.tpl.html',
      bindToController: true,
      scope: {
        matches : '=',
        today: '='
      }
    }
  }
})();