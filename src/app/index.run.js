(function() {
  'use strict';

  angular
    .module('myBall')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, AuthorizationService, UserService, $state, $stateParams, Restangular,
                    gettextCatalog, Conf, amMoment, $http) {
    var deregistrationCallbacks = {};
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.lang = 'fr';

    /*
    * Restangular
    * */
    Restangular.addFullRequestInterceptor(function(el, op, route, url, head, params) {
      var curHeaders, token;
      curHeaders = head;
      token = el.token || UserService.getToken();
      if (token !== null && typeof token !== 'undefined' && url.startsWith(Conf.WEBALL_API_BASE_URL)) {
        curHeaders['x-access-token'] = token;
      }
      return {
        element: el,
        params: params,
        headers: curHeaders
      };
    });

    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
      if(response.status === 401) {
        $state.go('signin');
        // Repeat the request and then call the handlers the usual way.
        $http(response.config).then(responseHandler, deferred.reject);
        // Be aware that no request interceptors are called this way.

        return false; // error handled
      }

      return true; // error not handled
    });
    /*
    * Internationalization
    * */
    deregistrationCallbacks.watch = $rootScope.$watch('lang', function(newVal){
      if (newVal) {
        gettextCatalog.setCurrentLanguage(newVal);
        gettextCatalog.loadRemote("/translations/" + newVal + ".json");
        amMoment.changeLocale(newVal);
        $log.debug('change lang::', newVal);
      }
    });
    /*
    * Access states
    * */
    deregistrationCallbacks.stateChangeStart = $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      //http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
      $log.debug('State change:: ' + toState.name);
      // track the state the user wants to go to; authorization service needs this
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;
      // if the principal is resolved, do an authorization check immediately. otherwise,
      // it'll be done when the state itresolved.
      if (UserService.isIdentityResolved()) AuthorizationService.authorize();
    });
    /*
    * Progress
    * */
    deregistrationCallbacks.viewContentLoading = $rootScope.$on('$viewContentLoading', function(){
      $rootScope.$emit('loading', true);
    });
    deregistrationCallbacks.viewContentLoaded = $rootScope.$on('$viewContentLoaded', function(){
      $rootScope.$emit('loading', false);
    });
    for (var idx in deregistrationCallbacks) {
      $rootScope.$on('$destroy', deregistrationCallbacks[idx]);
    }
  }
})();
