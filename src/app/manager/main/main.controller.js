(function(){
  'use strict';
  angular.module('myBall')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(UserService, MatchesService, CalendarService, gettextCatalog, $rootScope) {
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
    
    var checkStatus = function(match, today) {
      var endDate = new Date(match.endDate);
      if (_.isEmpty(match.teams) || match.teams[0].length + match.teams[1].length !== match.maxPlayers) {
        vm.data.counters[0].number += 1;
      }
      else if (endDate.getTime() < today.getTime()) {
        vm.data.counters[1].number += 1;
      }
    };
    
    var checkDate = function(match, today) {
      var startDate = new Date(match.startDate);
      if (startDate.getFullYear() === today.getFullYear()){
        if (startDate.getMonth() === today.getMonth()) {
          vm.data.counters[2].number += 1;
          if (CalendarService.getWeekOfYear(startDate) === CalendarService.getWeekOfYear(today)){
            vm.data.counters[3].number += 1;
            if (startDate.getDate() === today.getDate()) {
              vm.data.counters[4].number += 1;
            }
          }
        }
      }
    };
    
    var init = function() {
      var today = new Date();
      var params = {
        startDate: today,
        endDate: new Date(today.getFullYear() + 10, today.getMonth(), today.getDate())
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
      })
    };
    init()
  }
})();