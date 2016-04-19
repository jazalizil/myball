/**
 * Created by jazalizil on 10/12/15.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('FieldEditController', FieldEditController);
  /** @ngInject */
  function FieldEditController($mdDialog, $scope, _, $log, $q, Upload, FieldsService) {
    var vm = this;
    vm.data = FieldsService.getDatas();
    vm.errors = {
      name : {},
      defaultPrice : {}
    };
    vm.field = {};

    $scope.$watch(function(){
      return vm.data.defaultPrice
    }, function(newVal){
      var defaultPrice;
      if (newVal) {
        defaultPrice = Number(newVal);
        _.forEach(vm.field.pricesPerHour, function(pricesPerHour){
          _.forEach(pricesPerHour, function(pricePerHour){
            pricePerHour.price = defaultPrice;
          })
        });
        vm.field.available = true;
      }
      else {
        vm.field.available = false;
      }
    });

    $scope.$watch(function(){
      return vm.data.selectDays
    }, function(newVal){
      if (newVal && newVal.value === 'WORKING_DAYS') {
        _.forEach(vm.days, function(day){
          vm.toggleDay(day);
        });
      }
    });

    $scope.$watch(function(){
      return vm.field.name;
    }, function(newVal){
      if (newVal) {
       vm.errors.name = {};
      } else if (vm.errors.submitted) {
        vm.errors.name.required = true;
      }
    });

    function fieldValidation() {
      var pricesPerHourTmp, deferred;

      deferred = $q.defer();
      if (!vm.field.name) {
        vm.errors.name.required = true;
        vm.errors.submitted = true;
        deferred.reject();
      }
      _.forEach(vm.field.pricesPerHour, function(pricesPerHour, dayKey){
        pricesPerHourTmp = angular.copy(pricesPerHour);
        vm.field.pricesPerHour[dayKey] = {};
        _.forEach(pricesPerHourTmp, function(pricePerHour){
          vm.field.pricesPerHour[dayKey][pricePerHour.hour] = pricePerHour.price;
        })
      });
      if (!vm.field.photo) {
        deferred.resolve();
      }
      else if (vm.field.photo.name) {
        Upload.dataUrl(vm.field.photo, function(url){
          vm.field.photo = url;
          deferred.resolve();
        })
      }
      return deferred.promise;
    }

    vm.closeDialog = function() {
      fieldValidation().then(function(){
        $mdDialog.hide(vm.field);
      })
    };

    vm.cancelDialog = function() {
      $mdDialog.cancel();
    };

    vm.isDaySelected = function(day) {
      return typeof vm.field.pricesPerHour[day.number] !== 'undefined';
    };

    vm.isHourSelected = function(dayNumber, hour) {
      var pricePerHour = _.find(vm.field.pricesPerHour[dayNumber], function(pricesPerHour){
        return pricesPerHour.hour === hour;
      });
      return pricePerHour.price !== -1;
    };

    vm.toggleDay = function(day) {
      if(vm.field.pricesPerHour[day.number]) {
        vm.field.pricesPerHour[day.number] = void 0;
      }
      else {
        vm.field.pricesPerHour[day.number] = [];
      }
    };

    vm.transformHourChip = function($chip) {
      $log.debug($chip);
    };

    vm.showHourPriceInput = function($chip, dayNumber) {
      var index = _.findIndex(vm.field.pricesPerHour[dayNumber], function(pricePerHour){
        return pricePerHour.hour === $chip.hour;
      });
      vm.data.hourPriceInput = {
        hour: $chip.hour,
        price: $chip.price,
        day: dayNumber,
        hourIndex: index
      };
    };

    vm.hidePriceInput = function() {
      vm.data.hourPriceInput = void 0;
    };

    /** Start initialization block **/
    function initializepricesPerHour(oldPricesPerHour) {
      var days = _.range(7);
      var i, j, day, hour, lenDays = days.length, lenHours = vm.data.hours.length;

      for (i = 1; i < lenDays; i++) {
        day = days[i].toString();
        vm.field.pricesPerHour[day] = [];
        for (j = 0; j < lenHours; j++) {
          hour = vm.data.hours[j].toString();
          vm.field.pricesPerHour[day].push({
            hour : hour,
            price : oldPricesPerHour ? oldPricesPerHour[day][hour] : -1
          });
        }
      }
    }
    function init() {
      var oldPricesPerHour = void 0;
      if (!_.isEmpty(vm.field)) {
        oldPricesPerHour = angular.copy(vm.field.pricesPerHour);
      }
      vm.field.pricesPerHour = {};
      initializepricesPerHour(oldPricesPerHour);
      vm.field.available = false;
      vm.data.selectedDays = vm.data.selectDays[0].value;
      vm.data.selectedHours = vm.data.selectHours[0].value;
    }

    init();
    /** End initialization block */
  }
})();