(function() {
  'use strict';

  angular
    .module('myBall')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
    $urlRouterProvider.when('', '/');
    $stateProvider.state('start', {
      parent: 'public',
      url: '/',
      controller: 'StartController',
      controllerAs: 'start',
      templateUrl: 'app/common/components/start/splash.html'
    }).state('protected', {
      abstract: true,
      resolve: {
        authorize: function(AuthorizationService) {
          return AuthorizationService.authorize();
        }
      },
      templateUrl: 'content.html'
    }).state('public', {
      abstract: true,
      templateUrl: 'content.html'
    }).state('accessdenied', {
      parent: 'public',
      url: '/accessdenied'
    }).state('signin', {
      parent: 'public',
      url: '/signin',
      templateUrl: 'app/common/404/404.html',
      controller: 'SigninController',
      controllerAs: 'signin'
    }).state('forgot', {
      parent: 'public',
      url: '/forgot',
      templateUrl: 'app/common/signin/forgot.html',
      controller: 'ForgotController',
      controllerAs: 'forgot'
    }).state('forgot.reset', {
      parent: 'public',
      url: '/forgot/:token',
      templateUrl: 'app/common/signin/forgot.html',
      controller: 'ForgotController',
      controllerAs: 'forgot'
    }).state('register', {
      parent: 'public',
      url: '/register',
      templateUrl: 'app/common/404/404.html',
      controller: 'RegisterController',
      controllerAs: 'register'
    }).state('404', {
      parent: 'public',
      url: '/404',
      templateUrl: 'app/common/404/404.html'
    });
    /** Manager routes **/
    $stateProvider.state('cgu', {
      parent: 'public',
      url: '/cgu',
      templateUrl: 'app/common/cgu/cgu.html'
    }).state('confidentiality', {
      parent: 'public',
      url: '/confidentiality',
      templateUrl: 'app/common/confidentiality/confidentiality.html'
    }).state('profil', {
      parent: 'protected',
      url: '/profil',
      templateUrl: 'app/common/404/404.html',
      controller: 'ProfilController',
      controllerAs: 'profil'
    }).state('parameters', {
      parent: 'protected',
      url: '/parameters',
      templateUrl: 'app/common/404/404.html',
      controller: 'ParametersController',
      controllerAs: 'parameters'
    }).state('fives', {
      parent: 'protected',
      url: '/five',
      templateUrl: 'app/common/404/404.html',
      controller: 'FiveController',
      controllerAs: 'fives'
    });
    /** End manager routes **/
    $urlRouterProvider.otherwise('/404');
    $urlMatcherFactoryProvider.strictMode(false);
  }
})();
