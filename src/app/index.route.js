(function() {
  'use strict';

  angular
    .module('myBall')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
    $urlRouterProvider.when('', '/app');
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
      url: '/app/accessdenied'
    }).state('home', {
      parent: 'public',
      url: '/app/home',
      templateUrl: 'app/common/home/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
    }).state('signin', {
      parent: 'public',
      url: '/app/signin',
      templateUrl: 'app/common/signin/signin.html',
      controller: 'SigninController',
      controllerAs: 'signin'
    }).state('register', {
      parent: 'public',
      url: '/app/register',
      templateUrl: 'app/common/register/register.html',
      controller: 'RegisterController',
      controllerAs: 'register'
    }).state('start', {
      parent: 'public',
      url: '/app',
      controller: 'StartController',
      controllerAs: 'start',
      templateUrl: ''
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
      url: "/app/main",
      templateUrl: "app/manager/main/main.html",
      controller: "MainController",
      controllerAs: "main"
    }).state('matchs', {
      parent: "protected",
      url: "/app/matchs",
      templateUrl: "app/manager/matches/matches.html",
      controller: "MatchesController",
      controllerAs: "matches"
    }).state('players', {
      parent: "protected",
      url: "/app/players",
      templateUrl: "app/manager/players/players.html",
      controller: "PlayersController",
      controllerAs: "players"
    });
    /** End manager routes **/
    $urlRouterProvider.otherwise('/404');
    $urlMatcherFactoryProvider.strictMode(false);
  }
})();
