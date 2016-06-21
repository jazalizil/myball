/**
 * Created by jazalizil on 18/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('MatchesController', MatchesController);
  /** @ngInject */
  function MatchesController(UserService, MatchesService, _, $scope, $mdSidenav, gettextCatalog, toastr,
                             $log, $rootScope, Socket) {
    var vm = this;
    vm.data = {
      identity: angular.copy(UserService.getIdentity()),
      placeholders: {
        paid: gettextCatalog.getString('Payé'),
        name: gettextCatalog.getString('Nom complet'),
        email: gettextCatalog.getString('Email'),
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

    $scope.$on('socket:new match', function(ev, data){
      $log.debug('Socket new match:', data);
      MatchesService.setStatus(data);
      vm.data.allMatches.push(data);
      var startDate = new Date(data.startDate);
      var hourIdx = _.findIndex(vm.data.hours, function(hour){
        return hour.value === startDate.getHours();
      });
      vm.data.hours[hourIdx].matches[data.field] = data;
      if (vm.data.matchEditing && vm.data.selectedHour.value === startDate.getHours()) {
        toastr.error(gettextCatalog.getString('Le match que vous éditez vient d\'être réservé via weBall'));
      }
    });

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
      vm.data.responsable = {};
      if (hour.matches[field._id]) {
        vm.data.responsable = hour.matches[field._id].responsable || {};
      }
      vm.data.responsable.errors = {};
      vm.data.currentField = field;
      if (vm.data.selectedHour.value * 10 % 10 !== 0) {
        vm.data.selectedHour.value = Math.floor(vm.data.selectedHour.value);
        vm.data.selectedHour.isHalf = true;
        if (!vm.data.match.createdDate) {
          vm.data.match.startDate.setMinutes(30);
          vm.data.match.endDate.setMinutes(30);
        }
      }
      $log.debug(vm.data.match);
      $mdSidenav('match').toggle();
    };
    
    vm.delete = function() {
      vm.data.isDeletingMatch = true;
      MatchesService.delete(vm.data.match._id).then(function(){
        var hour = _.find(vm.data.hours, function(hour){
          return hour.value === vm.data.selectedHour.value;
        });
        hour.matches[vm.data.match.field] = {};
        var matchIndex = _.findIndex(vm.data.allMatches, function(match){
          return match._id === vm.data.match._id;
        });
        vm.data.allMatches.splice(matchIndex, 1);
        vm.data.isDeletingMatch = false;
        $mdSidenav('match').close();
        toastr.success(gettextCatalog.getString('Match supprimé avec succès'));
      }, function(err){
        vm.data.isDeletingMatch = false;
        toastr.error(angular.isString(err.data.message) ? err.data.message : gettextCatalog.getString('Serveur indisponible'), gettextCatalog.getString('Erreur'));
      })
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
        payload.match = vm.data.match;
        payload.match.responsable = _.pickBy(vm.data.responsable, function(val, key){
          return key !== 'errors';
        });
        $log.debug(payload);
        MatchesService.put(payload).then(function(match){
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
          $mdSidenav('match').close();
          toastr.success(gettextCatalog.getString('Match crée avec succès'));
        }, function(err){
          var now = new Date();
          if (vm.data.match.startDate.getTime() < now.getTime()) {
            toastr.error(gettextCatalog.getString('Impossible de créer un match dans le passé'), gettextCatalog.getString('Erreur'));
          }
          else {
            toastr.error(angular.isString(err.data.message) ? err.data.message : gettextCatalog.getString('Serveur indisponible'), gettextCatalog.getString('Erreur'));
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
          text: hour + ':00',
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
          _.each(vm.data.allMatches, function(match){
            MatchesService.setStatus(match);
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
      Socket.emit('join five', vm.data.identity.five._id, function(cb){
        $log.debug('emit:', cb);
      });
      Socket.forward('new match', $scope);
    };
    init();
  }
})();