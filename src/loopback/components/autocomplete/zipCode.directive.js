(function(){
  'use strict';
  angular.module('myBall').directive('zipCodeAutocomplete', zipCodeAutocomplete);

  function zipCodeAutocomplete() {
    /** @ngInject */
    function ZipCodeController(Cities, $log, $scope, $filter, _, gettextCatalog) {
      var createFilterFor, vm;
      vm = this;
      vm.data = {
        cities: Cities(),
        label: gettextCatalog.getString("Code Postal")
      };
      $scope.$watch(function() {
        return vm.data.selectedCity;
      }, function(newVal) {
        if (newVal != null) {
          vm.ngModel.city = $filter('capitalize')(newVal.name);
          vm.ngModel.zipCode = newVal.zipCode;
          vm.form.zipCodeAutocomplete.$setValidity('invalid', true);
        }
        else if (vm.form.submitted && newVal == null) {
          vm.form.zipCodeAutocomplete.$setValidity('invalid', false);
        }
        else {
          vm.ngModel.city = void 0;
          vm.ngModel.zipCode = void 0;
        }
      });
      createFilterFor = function(query) {
        return function(city) {
          return city.zipCode.indexOf(query) === 0;
        };
      };

      vm.dataSearch = function() {
        if (!vm.data.filteredCities || !vm.data.searchZipCode || !vm.data.filteredCities.length) {
          return;
        }
        else if (vm.data.searchZipCode.length === 5
            && vm.data.filteredCities[0].zipCode === vm.data.searchZipCode) {
          vm.data.selectedCity = vm.data.filteredCities[0];
        }
      };

      vm.querySearch = function(query) {
        if (query) {
          return vm.data.filteredCities = _.filter(vm.data.cities, createFilterFor(query));
        }
        return [];
      };
    }

    return {
      restrict: 'E',
      scope: {
        ngModel: '=',
        form: '='
      },
      templateUrl: 'app/manager/components/autocomplete/zipCode.tpl.html',
      controller: ZipCodeController,
      controllerAs: 'vm',
      bindToController: true
    };
  }
})();