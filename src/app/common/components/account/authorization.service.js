(function(){
  'use strict';
  angular.module('myBall').factory('AuthorizationService', AuthorizationService);

  /** @ngInject */
  function AuthorizationService(UserService, $state, $rootScope, Restangular, localStorageService) {
    var methods;
    return methods = {
      authorize: function() {
        return UserService.identity().then(function() {
          var isAuthenticated;
          isAuthenticated = UserService.isAuthenticated();
          // store isAuthenticated in rootscope in order to show/hide the sidebar
          $rootScope.isAuthenticated = isAuthenticated;
          if ($rootScope.toState.data && $rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !UserService.isInAnyRole($rootScope.toState.data.roles)) {
            if (isAuthenticated === true) {
              $state.go('accessdenied');
            } else {
              // user is not authenticated. stow the state they wanted before you
              // send them to the signin state, so you can return them when you're done
              $rootScope.returnToState = $rootScope.toState;
              $rootScope.returnToStateParams = $rootScope.toStateParams;
              // now, send them to the signin state so they can log in
              $state.go('signin');
            }
          }
        }, function(){
          // user is not authenticated, send him to signin
          $state.go('signin');
        });
      },
      login: function(email, password) {
        return Restangular.one('login').post('managers', {
          login: email,
          password: password
        }).then(function(res) {
          UserService.updateToken(res.token);
        });
      },
      logout: function() {
        UserService.authenticate(void 0);
        localStorageService.clearAll();
        $state.go('home');
      },
      register: function(five) {
        return Restangular.one('/').post('managers', five).then(function() {
          return methods.login(five.manager.email, five.manager.password);
        });
      },
      patch: function(manager) {
        return Restangular.one('/').patch('managers', manager);
      }
    };
  }
})();