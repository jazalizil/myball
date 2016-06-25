(function(){
  'use strict';
  angular.module('myBall')
    .factory('AuthorizationService', AuthorizationService);
  /** @ngInject */
  function AuthorizationService(UserService, $state, $rootScope, Restangular, localStorageService, $log) {
    var methods;
    return methods = {
      authorize: function() {
        return UserService.identity().then(function(me) {
          var isAuthenticated;
          isAuthenticated = UserService.isAuthenticated();
          $log.debug('me:', me, 'auth:', isAuthenticated);
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
      login: function(email, password, remember) {
        return Restangular.one('login').post('users', {
          login: email,
          password: password
        }).then(function(res) {
          UserService.updateToken(res.token, remember);
        });
      },
      logout: function() {
        UserService.authenticate(null);
        localStorageService.clearAll();
        $state.go('signin');
      },
      register: function(five) {
        return Restangular.one('/').post('users', five).then(function() {
          return methods.login(five.manager.email, five.manager.password);
        });
      },
      forgot: function(email) {
        return Restangular.one('users', 'resetpassword').patch({
          email: email
        });
      },
      reset: function(token, password) {
        return Restangular.one('users', 'me').patch({
          password: password,
          token: token
        });
      }
    };
  }
})();