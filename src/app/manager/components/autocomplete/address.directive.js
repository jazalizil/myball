(function(){
  'use strict';
  /**
   * Created by jazalizil on 07/12/15.
   */
  angular.module('myBall')
    .directive('addressAutocomplete', addressAutocomplete);

  function addressAutocomplete() {
    /** @ngInject */
    function AddressAutocompleteController(GouvDataRestangular, $scope, gettextCatalog) {
      var vm = this;
      vm.data = {
        label: gettextCatalog.getString("Adresse")
      };

      $scope.$watch(function(){
        return vm.zipCode;
      }, function(newVal){
        if (!newVal) {
          vm.data.searchAddress = void 0;
        }
      });

      $scope.$watch(function(){
        return vm.ngModel;
      }, function(newVal){
        if (newVal) {
          vm.form.addressAutocomplete.$setValidity('invalid', true);
        }
        else if (!newVal && vm.form.submitted) {
          vm.form.addressAutocomplete.$setValidity('invalid', false);
        }
      });

      vm.querySearch = function(query) {
        return GouvDataRestangular.one('/')
          .get({
            q: query,
            postcode: vm.zipCode
          })
          .then(function(res){
            return res.features;
          });
      }
    }

    return {
      restrict: 'E',
      controller: AddressAutocompleteController,
      controllerAs: 'vm',
      templateUrl: 'app/manager/components/autocomplete/address.tpl.html',
      bindToController: true,
      scope: {
        ngModel: '=',
        form: '=',
        zipCode: '='
      }
    }
  }
})();