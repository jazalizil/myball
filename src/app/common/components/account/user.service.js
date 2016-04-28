(function(){
  'use strict';
  angular.module('myBall').factory('UserService', UserService);

  /** @ngInject */
  function UserService($q, Restangular, localStorageService) {
    var _authenticated, _identity, _token, _setIdentity;
    _identity = localStorageService.get('identity');
    _authenticated = true;
    _token = void 0;
    if (typeof _identity === 'undefined') {
      _identity = void 0;
      _authenticated = false;
    }
    _setIdentity = function(identity) {
      _identity = identity;
      // _identity.roles = [identity.roles];
      localStorageService.set('identity', _identity);
      _authenticated = true;
    };
    return {
      updateToken: function(token) {
        _token = token;
        _authenticated = true;
        localStorageService.set('token', token);
      },
      getToken: function() {
        if (_token != null) {
          return _token;
        }
        return localStorageService.get('token');
      },
      getIdentity: function() {
        return _identity;
      },
      isIdentityResolved: function() {
        return _identity !== null;
      },
      isAuthenticated: function() {
        return _authenticated;
      },
      isInRole: function(role) {
        if (!_authenticated || !_identity.roles) {
          return false;
        }
        return _identity.roles.indexOf(role) !== -1;
      },
      isInAnyRole: function(roles) {
        var i, len, role;
        if (!_authenticated || !_identity.roles) {
          return false;
        }
        for (i = 0, len = roles.length; i < len; i++) {
          role = roles[i];
          if (this.isInRole(role)) {
            return true;
          }
        }
        return false;
      },
      authenticate: function(identity) {
        _identity = identity;
        _authenticated = identity != null;
      },
      setIdentity: function(identity) {
        _setIdentity(identity);
      },
      identity: function(force) {
        var deferred;
        deferred = $q.defer();
        if (force === true) {
          _identity = void 0;
        }
        if (_identity) {
          _authenticated = true;
          deferred.resolve(_identity);
          return deferred.promise;
        }
        Restangular.one('managers', 'me').get().then(function(user) {
          _setIdentity(user);
          deferred.resolve(_identity);
        }, function(){
          _authenticated = false;
          deferred.reject();
        });
        return deferred.promise;
      },
      patch: function(manager) {
        return Restangular.one('managers', 'me').patch(manager)
          .then(function(manager){
            _identity.manager = manager;
            _setIdentity(_identity);
          });
      }
    };
  }
})();