(function(){
	'use strict';
	angular.module('myBall').factory('UserService', UserService);

	/** @ngInject */
	function UserService($q, Restangular, $cookies, localStorageService) {
		var _authenticated, _identity, _token;
		_identity = localStorageService.get('identity') || void 0;
		_authenticated = false;
		_token = void 0;
		return {
			updateToken: function(token) {
				_token = token;
				_authenticated = true;
				$cookies.put('token', token);
				Restangular.withConfig(function(RestangularConfigurer) {
					return RestangularConfigurer.setDefaultHeaders({
						'x-access-token': token
					});
				});
			},
			getToken: function() {
				if (_token != null) {
					return _token;
				}
				return $cookies.get('token');
			},
			getIdentity: function() {
				return _identity;
			},
			isIdentityResolved: function() {
				return angular.isDefined(_identity);
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
				Restangular.one('users', 'me').get().then(function(user) {
					_identity = user;
					_identity.roles = [user.roles];
					localStorageService.set('identity', _identity);
					_authenticated = true;
					deferred.resolve(user);
				}, function(err) {
					deferred.reject(err);
				});
				return deferred.promise;
			},
			update: function(type, user) {
				var deferred;
				deferred = $q.defer();
				Restangular.one('/' + type + '/me').patch(user).then(function(user) {
					deferred.resolve(user);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			},
			getFives: function(lat, lgt) {
				return Restangular.one('five').get({lat: lat, lgt: lgt}).then(function(five) {
					return five;
				});
			}
		};
	}
})();