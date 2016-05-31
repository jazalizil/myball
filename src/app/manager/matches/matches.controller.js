/**
 * Created by jazalizil on 18/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('MatchesController', MatchesController);
  /** @ngInject */
  function MatchesController(UserService, MatchesService, _, $scope, $mdSidenav, gettextCatalog, toastr,
                             $log, $rootScope) {
    var vm = this;
    vm.data = {
      identity: angular.copy(UserService.getIdentity()),
      placeholders: {
        paid: gettextCatalog.getString('Payé'),
        name: gettextCatalog.getString('Nom complet'),
        phone: gettextCatalog.getString('Numéro de téléphone')
      },
      today: {
        realDate: new Date()
      },
      statusToColor: MatchesService.statusToColor,
      startFrom: 0,
      limitTo: 6,
      teamSizes: [
        {
          value: 6,
          name: '3 vs 3'
        },
        {
          value: 10,
          name: '5 vs 5'
        }
      ]
    };

    $scope.$watch(function(){
      return vm.data.today
    }, function(newVal, oldVal){
      if (!newVal) {
        return;
      }
      else if (oldVal.year && oldVal.year !== newVal.year) {
        vm.data.today.realDate.setFullYear(+newVal.year);
        $rootScope.$broadcast('loading', true);
        fetchMatches(+newVal).then(function(){
          $rootScope.$broadcast('loading', false);
        }, function(){
          $rootScope.$broadcast('loading', false);
        });
      }
      getHours();
    }, true);

    vm.openSidenav = function(hour, field) {
      vm.data.selectedHour = angular.copy(hour);
      vm.data.match = hour.matches[field._id] || {
          maxPlayers: vm.data.teamSizes[1].value,
          field: field._id,
          startDate: new Date(vm.data.today.year, vm.data.today.month, vm.data.today.date, Math.floor(vm.data.selectedHour.value)),
          endDate: new Date(vm.data.today.year, vm.data.today.month, vm.data.today.date, Math.floor(vm.data.selectedHour.value) + 1)
        };
      vm.data.responsable = {
        errors: {}
      };
      if (vm.data.selectedHour.value * 10 % 10 !== 0) {
        vm.data.selectedHour.value = Math.floor(vm.data.selectedHour.value);
        vm.data.selectedHour.isHalf = true;
        if (!vm.data.match.createdDate) {
          vm.data.match.startDate.setMinutes(30);
          vm.data.match.endDate.setMinutes(30);
        }
      }
      $log.debug(vm.data.match);
      $mdSidenav('right').toggle();
    };

    vm.send = function() {
      var payload = {}, hour;
      if (!vm.data.responsable.name) {
        vm.data.responsable.errors.name = true;
      }
      else if (!vm.data.responsable.phone || vm.data.responsable.phone.length !== 10) {
        vm.data.responsable.errors.phone = true;
      }
      else {
        vm.data.isUploadingMatch = true;
        payload.responsable = _.pickBy(vm.data.responsable, function(val, key){
          return key !== 'errors';
        });
        payload.match = vm.data.match;
        $log.debug(payload);
        MatchesService.put(payload).then(function(match){
          $log.debug(match.plain());
          if (vm.data.selectedHour.isHalf) {
            vm.data.selectedHour.value += 0.5;
          }
          hour = _.find(vm.data.hours, function(hour){
            return hour.value === vm.data.selectedHour.value;
          });
          match.status = 'ready';
          match.teams = [{
            status: 'ready'
          },{
            status: 'ready'
          }];
          hour.matches[match.field] = match;
          vm.data.allMatches.push(match);
          vm.data.isUploadingMatch = false;
          $mdSidenav('right').close();
          toastr.success(gettextCatalog.getString('Match crée avec succès'));
        }, function(err){
          var now = new Date();
          if (vm.data.match.startDate.getTime() < now.getTime()) {
            toastr.error(gettextCatalog.getString('Impossible de créer un match dans le passé'), gettextCatalog.getString('Erreur'));
          }
          else {
            toastr.error(typeof err.data.message === 'string' ? err.data.message : gettextCatalog.getString('Serveur indisponible'), gettextCatalog.getString('Erreur'));
          }
          $log.debug(vm.data.match, err);
          vm.data.isUploadingMatch = false;
        })
      }
    };

    var getHours = function(){
      var toPush, hours = _.range(9, 26, 0.5);
      vm.data.hours = [];
      _.each(hours, function(hour){
        toPush = {
          value: hour,
          slots: {},
          matches: {},
          status: 'free'
        };
        _.each(vm.data.today.matches, function(match){
          if (match.startDate.getHours() !== hour ||
            (match.startDate.getMinutes() === 30 && match.startDate.getHours() !== Math.floor(hour))) {
            return;
          }
          toPush.matches[match.field] = match;
        });
        vm.data.hours.push(toPush);
      });
    };

    var fetchMatches = function(y) {
      var params = {}, year = y || vm.data.today.realDate.getFullYear();
      params.startDate = new Date(year, 0, 15);
      params.endDate = new Date(year, 12, 31);
      return MatchesService.fetchAll(params)
        .then(function(res){
          vm.data.allMatches = res;
          // WIP : status  =  ready if match.maxPlayers == match.currentPlayers ;
          //                 waiting else if match.maxPlayers != match.currentPlayers;
          //                 over if match.endDate < currentDate;
          //                 free else
          _.each(vm.data.allMatches, function(match){
            match.teams = match.teams.length ? match.teams : [{},{}];
            var matchDate = new Date(match.endDate);
            if (matchDate.getTime() < vm.data.today.realDate.getTime()) {
              match.status = 'over';
              match.teams[0].status = 'over';
              match.teams[1].status = 'over';
            }
            else if (match.maxPlayers !== match.currentPlayers) {
              match.status = 'waiting';
              match.teams[0].status = match.teams[0].users && match.teams[0].users.length === match.maxPlayers / 2 ?
                'ready' : 'waiting';
              match.teams[1].status = match.teams[1].users && match.teams[1].users.length === match.maxPlayers / 2 ?
                'ready' : 'waiting';
            }
            else {
              match.status = 'ready';
              match.teams[0].status = 'ready';
              match.teams[1].status = 'ready';
            }
          })
        });
    };

    var init = function() {
      vm.data.fields = vm.data.identity.five.fields;
      $rootScope.$broadcast('loading', true);
      fetchMatches().then(function(){
        $rootScope.$broadcast('loading', false);
      }, function(){
        $rootScope.$broadcast('loading', false);
      });
    };
    init();
  }
})();