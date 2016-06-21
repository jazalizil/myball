(function(){
  'use strict';
  angular.module('myBall')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(UserService, MatchesService, CalendarService, gettextCatalog, $rootScope, _, Socket, $scope, $log) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity(),
      counters: [
        {
          text: gettextCatalog.getString('en attente'),
          number: 0
        },
        {
          text: gettextCatalog.getString('confirmés'),
          number: 0
        },
        {
          text: gettextCatalog.getString('aujourd\'hui'),
          number: 0
        },
        {
          text: gettextCatalog.getString('cette semaine'),
          number: 0
        },
        {
          text: gettextCatalog.getString('ce mois'),
          number: 0
        }
      ]
    };

    $scope.$on('socket:new match', function(ev, match){
      $log.debug('new match:', match);
      var today = new Date();
      checkStatus(match, today);
      checkDate(match, today);
    });

    var add = function(idx) {
      var counter = vm.data.counters[idx];
      counter.number += 1;
    };
    
    var checkStatus = function(match, today) {
      var endDate = new Date(match.endDate);
      if (_.isEmpty(match.teams) || match.teams[0].length + match.teams[1].length !== match.maxPlayers) {
        add(0);
      }
      else if (endDate.getTime() < today.getTime()) {
        add(1);
      }
    };
    
    var checkDate = function(match, today) {
      var startDate = new Date(match.startDate);
      if (startDate.getFullYear() === today.getFullYear()){
        if (startDate.getMonth() === today.getMonth()) {
          add(4);
          if (CalendarService.getWeekOfYear(startDate) === CalendarService.getWeekOfYear(today)){
            add(3);
            if (startDate.getDate() === today.getDate()) {
              add(2);
            }
          }
        }
      }
    };
    
    var init = function() {
      var today = new Date();
      var params = {
        startDate: today,
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 1)
      };
      $rootScope.$broadcast('loading', true);
      MatchesService.fetchAll(params).then(function(matches){
        _.each(matches, function(match){
          checkStatus(match, today);
          checkDate(match, today);
        });
        $rootScope.$broadcast('loading', false);
      }, function() {
        $rootScope.$broadcast('loading', false);
      });
      Socket.emit('join five', vm.data.identity.five._id);
      Socket.forward('new match', $scope);
    };
    init()
  }
})();