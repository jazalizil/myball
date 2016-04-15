(function(){
  'use strict';
  angular.module('myBall').directive('mbNavbar', mbNavbar);

  function mbNavbar() {
    /** @ngInject */
    function NavbarController($state, UserService, AuthorizationService, gettextCatalog) {
      var vm = this;
      vm.data = {
        activeState : $state.current.name,
        isSignupState : $state.current.name === 'signup',
        identity: UserService.getIdentity(),
        links: [
          {
            text: gettextCatalog.getString('Accueil'),
            url: 'main'
          },
          {
            text: gettextCatalog.getString('Matchs'),
            url: 'matchs'
          },
          {
            text: gettextCatalog.getString('Joueurs'),
            url: 'players'
          }
        ],
        searchPlaceholder: gettextCatalog.getString('Rechercher un joueur'),
        searchIcon: 'search'
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
      vm.toggleMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
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
    }

    return {
      restrict: 'E',
      controller: NavbarController,
      controllerAs: 'navbar',
      templateUrl: 'app/manager/components/navbar/navbar.html',
      scope: {
        opaq : '='
      },
      bindToController: true
    };
  }
})();