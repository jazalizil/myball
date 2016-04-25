(function() {
  'use strict';

  angular
    .module('myBall')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, AuthorizationService, UserService, $state, $stateParams, Restangular,
                    gettextCatalog, Conf) {
    var deregistrationCallbacks = {};
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.lang = 'fr';
    Restangular.setFullRequestInterceptor(function(el, op, route, url, head, params) {
      var curHeaders, token;
      curHeaders = head;
      token = UserService.getToken();
      if (token !== void 0 && url.startsWith(Conf.WEBALL_API_BASE_URL)) {
        curHeaders['x-access-token'] = token;
      }
      return {
        element: el,
        params: params,
        headers: curHeaders
      };
    });
    deregistrationCallbacks.watch = $rootScope.$watch('lang', function(newVal){
      if (newVal) {
        gettextCatalog.setCurrentLanguage(newVal);
        gettextCatalog.loadRemote("/translations/" + newVal + ".json");
      }
    });
    deregistrationCallbacks.stateChangeStart = $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      //http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
      $log.debug('State change start : ' + toState.name);
      // track the state the user wants to go to; authorization service needs this
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;
      $rootScope.isLoaded = false;
      // if the principal is resolved, do an authorization check immediately. otherwise,
      // it'll be done when the state itresolved.
      if (UserService.isIdentityResolved()) AuthorizationService.authorize();
    });
    deregistrationCallbacks.viewContentLoaded = $rootScope.$on('$viewContentLoaded', function(){
      $rootScope.isLoaded = true;
    });
    $rootScope.$on('$destroy', deregistrationCallbacks.viewContentLoaded);
    $rootScope.$on('$destroy', deregistrationCallbacks.stateChangeStart);
    $rootScope.$on('$destroy', deregistrationCallbacks.watch);
  }

})();
