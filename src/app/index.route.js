(function() {
  'use strict';

  angular
    .module('myBall')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
    $urlRouterProvider.when('', '/');
    $stateProvider.state('protected', {
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
    }).state('home', {
      parent: 'public',
      url: '/home',
      templateUrl: 'app/common/home/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
    }).state('signin', {
      parent: 'public',
      url: '/signin',
      templateUrl: 'app/common/signin/signin.html',
      controller: 'SigninController',
      controllerAs: 'signin'
    }).state('register', {
      parent: 'public',
      url: '/register',
      templateUrl: 'app/common/register/register.html',
      controller: 'RegisterController',
      controllerAs: 'register'
    }).state('start', {
      parent: 'public',
      url: '/',
      controller: 'StartController',
      controllerAs: 'start',
      templateUrl: ''
    }).state('404', {
      parent: 'public',
      url: '/404',
      templateUrl: 'app/common/404/404.html'
    });
    $urlRouterProvider.otherwise('/404');
    $urlMatcherFactoryProvider.strictMode(false);
  }
})();
