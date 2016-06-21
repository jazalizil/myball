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

    Socket.on('new match', function(match){
      $log.debug('Socket new match:', match);
      var today = new Date();
      checkStatus(match, today);
      checkDate(match, today);
    });
    
    var add = function(idx) {
      var counter = vm.data.counters[idx];
      counter.number += 1;
    };
    
    var checkStatus = function(match, today) {
      var startDate = new Date(match.startDate);
      if (!_.isEmpty(match.teams) && match.teams[0].length + match.teams[1].length === match.maxPlayers) {
        add(1);
      }
      else if (startDate.getTime() > today.getTime() &&
        (_.isEmpty(match.teams) || match.teams[0].length + match.teams[1].length !== match.maxPlayers)) {
        add(0)
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
      Socket.emit('join five', vm.data.identity.five._id);
      var params = {
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 1)
      };
      $rootScope.$broadcast('loading', true);
      MatchesService.fetchAll(params).then(function(matches){
        _.each(matches, function(match){
          checkStatus(match, today);
          checkDate(match, today);
        });
        // Socket.forward('new match', $scope);
        $rootScope.$broadcast('loading', false);
      }, function() {
        $rootScope.$broadcast('loading', false);
      });
    };
    init()
  }
})();