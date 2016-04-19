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
      templateUrl: ''
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
    }).state('404', {
      parent: 'public',
      url: '/404',
      templateUrl: 'app/common/404/404.html'
    });
    /** Manager routes **/
    $stateProvider.state('signup', {
      parent: "public",
      url: "/signup",
      templateUrl: "app/manager/signup/signup.html",
      controller: "SignupController",
      controllerAs: "signup"
    }).state('main', {
      parent: "protected",
      url: "/main",
      templateUrl: "app/manager/main/main.html",
      controller: "MainController",
      controllerAs: "main"
    }).state('matchs', {
      parent: "protected",
      url: "/matches",
      templateUrl: "app/manager/matches/matches.html",
      controller: "MatchesController",
      controllerAs: "matches"
    }).state('dashboard', {
      parent: "protected",
      url: "/dashboard",
      templateUrl: "app/manager/dashboard/dashboard.html",
      controller: "DahboardController",
      controllerAs: "dashboard"
    }).state('settings', {
      parent: "protected",
      url: "/settings",
      templateUrl: "app/manager/settings/settings.html",
      controller: "SettingsController",
      controllerAs: "settings"
    });
    /** End manager routes **/
    $urlRouterProvider.otherwise('/404');
    $urlMatcherFactoryProvider.strictMode(false);
  }
})();
