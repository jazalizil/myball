/**
 * Created by jazalizil on 21/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('RegisterController', RegisterController);
  /** @ngInject */
  function RegisterController(gettextCatalog) {
    var vm = this;
    vm.data = {
      form: 'MANAGER'
    };
    vm.manager = {};
    vm.user = {};
    /** Register **/
    vm.showForm = function(form) {
      vm.data.form = form;
    };
    /** Register manager **/
    vm.manager.submit = function() {
    }
  }
})();