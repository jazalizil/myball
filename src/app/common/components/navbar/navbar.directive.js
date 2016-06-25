(function(){
  'use strict';
  angular.module('myBall').directive('mbNavbar', mbNavbar);

  function mbNavbar() {
    /** @ngInject */
    function NavbarController(UserService, AuthorizationService, gettextCatalog) {
      var vm = this;
      vm.data = {
        searchPlaceholder: gettextCatalog.getString('Rechercher un joueur'),
        searchIcon: 'search',
        authenticated: UserService.isAuthenticated()
      };

      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
          return (state.value.indexOf(lowercaseQuery) === 0);
        };
      }

      vm.querySearch = function(query) {
        return createFilterFor(query);
      };
      vm.toggleMenu = function(open) {
        vm.data.menuOpen = open;
      };
      vm.toggleSearch = function() {
        if (vm.data.isSearching) {
          vm.data.isSearching = false;
          vm.data.searchIcon = 'search';
        } else {
          vm.data.isSearching = true;
          vm.data.searchIcon = 'close';
        }
      };
      vm.logout = function() {
        AuthorizationService.logout();
      };
      var init = function() {
        if (vm.data.authenticated) {
          vm.data.links =  [
            {
              text: gettextCatalog.getString('Accueil'),
              url: 'main'
            },
            {
              text: gettextCatalog.getString('Réservations'),
              url: 'matches'
            },
            {
              text: gettextCatalog.getString('Paramètres'),
              url: 'settings'
            }
          ];
        }
      };
      init();
    }

    return {
      restrict: 'E',
      controller: NavbarController,
      controllerAs: 'navbar',
      templateUrl: 'app/common/components/navbar/navbar.html',
      scope: {
        opaq : '='
      },
      bindToController: true
    };
  }
})();