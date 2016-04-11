(function(){
  'use strict';
  angular.module('myBall').controller('MainController', MainController);

  /** @ngInject */
  function MainController(gettextCatalog, UserService, Conf) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity(),
      imgs: [{
        src: Conf.CDN_BASE_URL + "images/footsalle-field.png"
      }]
    };
    vm.data.imgs[0].titles = [
      vm.data.identity.five.name
    ];
  }
})();