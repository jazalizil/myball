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
        phone: gettextCatalog.getString('Numéro de téléphone'),
        duration: gettextCatalog.getString('Durée du match')
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
          value: 8,
          name: '4 vs 4'
        },
        {
          value: 10,
          name: '5 vs 5'
        },
        {
          value: 12,
          name: '6 vs 6'
        }
      ],
      durations: [
        {
          value: 1,
          text: '1:00'
        },
        {
          value: 1.5,
          text: '1:30'
        },
        {
          value: 2,
          text: '2:00'
        }
      ],
      errors: {
        name: {
          text: gettextCatalog.getString('Veuillez entre un nom'),
          value: false
        },
        phone: {
          text: gettextCatalog.getString('Numéro de téléphone incorrect (10 chiffres)'),
          value: false
        }
      },
      match: {}
    };

    Socket.on('new match', function(data){
      MatchesService.setStatus(data);
      MatchesService.initDates(data);
      MatchesService.setDuration(data);
      vm.data.allMatches.push(data);
      var hourIdx = _.findIndex(vm.data.hours, function(hour){
        return hour.hours === data.startDate.hours && hour.minutes === data.startDate.minutes;
      });
      $log.debug('Socket new match:', data);
      vm.data.hours[hourIdx].matches[data.field] = data;
      if (vm.data.matchEditing && vm.data.selectedHour.value === data.startDate.hours) {
        toastr.warning(gettextCatalog.getString('Le match que vous éditez vient d\'être réservé via weBall'));
        vm.data.matchBooked = true;
        vm.data.match = vm.data.hours[hourIdx].matches[data.field];
      }
    });

    $scope.$watch(function(){
      return vm.data.teamSize;
    }, function(newVal){
      if (newVal) {
        vm.data.match.teams[0].currentPlayers = newVal / 2;
        vm.data.match.teams[1].currentPlayers = newVal / 2;
      }
    });

    $scope.$watch(function(){
      return vm.data.match.duration;
    }, function(newVal){
      if (typeof newVal !== 'undefined') {
        if (vm.data.match.startDate.minutes === 30) {
          if (newVal * 10 % 10 === 0) {
            vm.data.match.endDate.minutes = 30;
            vm.data.match.endDate.hours = vm.data.match.startDate.hours + newVal;
          } else {
            vm.data.match.endDate.minutes = 0;
            vm.data.match.endDate.hours = vm.data.match.startDate.hours + 2;
          }
        } else {
          vm.data.match.endDate.minutes = newVal * 10 % 10 === 0 ? 0 : 30;
          vm.data.match.endDate.hours = vm.data.match.startDate.hours + Math.floor(+newVal);
        }
        $log.debug('duration:', newVal, 'match:', vm.data.match);
      }
    });

    $scope.$watch(function(){
      return vm.data.today
    }, function(newVal, oldVal){
      if (!newVal.matches) {
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


    var createMatch = function(hour, field) {
      var dates;
      vm.data.selectedHour = angular.copy(hour);
      vm.data.hour = hour;
      vm.data.matchBooked = false;
      vm.data.responsable = {};
      if (hour.matches[field._id]) {
        vm.data.match = hour.matches[field._id];
        vm.data.teamSize = vm.data.match.maxPlayers;
        vm.data.responsable = vm.data.match.responsable || {
            name: vm.data.match.createdBy.fullName,
            email: vm.data.match.createdBy.email,
            phone: vm.data.match.createdBy.phone
          };
      }
      else {
        dates = MatchesService.getDates(vm.data.selectedHour, vm.data.today);
        vm.data.teamSize = 10;
        vm.data.match = {
          maxPlayers: vm.data.teamSize,
          field: field._id,
          startDate: dates.start,
          endDate: dates.end,
          duration: vm.data.durations[0].value,
          currentPlayers: vm.data.teamSize,
          createdBy: {
            name: 'Manager'
          },
          teams: [
            {
              name: gettextCatalog.getString('Équipe 1'),
              currentPlayers: vm.data.teamSize / 2
            },
            {
              name: gettextCatalog.getString('Équipe 2'),
              currentPlayers: vm.data.teamSize / 2
            }]
        };
      }
      vm.data.responsable.errors = angular.copy(vm.data.errors);
      vm.data.currentField = field;
      if (vm.data.selectedHour.value * 10 % 10 !== 0) {
        vm.data.selectedHour.value = Math.floor(vm.data.selectedHour.value);
      }
    };

    vm.openSidenav = function(hour, field) {
      createMatch(hour, field);
      $log.debug(vm.data.match);
      $mdSidenav('match').open();
    };
    
    vm.delete = function(match) {
      vm.data.isDeletingMatch = true;
      return MatchesService.delete(match._id).then(function(){
        var hour = _.find(vm.data.hours, function(hour){
          return hour.value === vm.data.selectedHour.value;
        });
        hour.matches[match.field] = {};
        var matchIndex = _.findIndex(vm.data.allMatches, function(m){
          return m._id === match._id;
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
    
    var uploadMatch = function(){
      var payload = {};
      vm.data.isUploadingMatch = true;
      payload.match = _.extend(MatchesService.cleanDates(vm.data.match), _.omit(vm.data.match, ['startDate', 'endDate', 'duration', 'teams']));
      payload.match.responsable = _.omit(vm.data.responsable, ['errors']);
      payload.teams = vm.data.match.teams;
      $log.debug('payload:', payload);
      MatchesService.put(payload).then(function(match){
        if (vm.data.selectedHour.isHalf) {
          vm.data.selectedHour.value += 0.5;
        }
        match.status = 'ready';
        MatchesService.setStatus(match);
        MatchesService.initDates(match);
        match.duration = vm.data.match.duration;
        vm.data.selectedHour.matches[match.field] = match;
        vm.data.allMatches.push(match);
        vm.data.isUploadingMatch = false;
        vm.data.matchBooked = false;
        $mdSidenav('match').close();
        toastr.success(gettextCatalog.getString('Match crée avec succès'));
      }, function(err){
        var now = new Date();
        if (vm.data.match.startDate.hour < now.getHours() && vm.data.match.startDate.getMinutes() < now.getMinutes()) {
          toastr.error(gettextCatalog.getString('Impossible de créer un match dans le passé'), gettextCatalog.getString('Erreur'));
        }
        else {
          toastr.error(angular.isString(err.data.message) ? err.data.message : gettextCatalog.getString('Serveur indisponible'), gettextCatalog.getString('Erreur'));
        }
        vm.data.responsable.errors = angular.copy(vm.data.errors);
        $log.debug(vm.data.match, err);
        vm.data.isUploadingMatch = false;
      })
    };

    vm.send = function() {
      if (!vm.data.responsable.name) {
        vm.data.responsable.errors.name.value = true;
        toastr.error(vm.data.responsable.errors.name.text, gettextCatalog.getString('Erreur'));
      }
      else if (!vm.data.responsable.phone || vm.data.responsable.phone.length !== 10) {
        vm.data.responsable.errors.phone.value = true;
        toastr.error(vm.data.responsable.errors.phone.text, gettextCatalog.getString('Erreur'));
      }
      else {
        uploadMatch(vm.data.match.createdAt);
      }
    };

    /** Drag'n'drop **/

    vm.dropOutMatch = function(el, drag) {
      var elem = angular.element(el.target);
      elem.removeClass('drop-over');
      $log.debug('out! ctn:', elem.attr('class'), 'drag:', drag);
    };
    vm.dropOverMatch = function(el, ui) {
      var elem = angular.element(el.target);
      var draggable = angular.element(ui.draggable[0]);
      elem.addClass('drop-over');
      elem.height(draggable.height());
      $log.debug('over! ui:', draggable.height(), 'el:', elem.height());
    };
    vm.dragMatchStart = function(el) {
      var elem = angular.element(el);
      $log.debug('drag start:', elem);
    };
    vm.dropOnMatch = function(el, ui) {
      var elem = angular.element(el.target);
      var draggable = angular.element(ui.draggable[0]);
      elem.append()
      var id = elem.attr('id').split('-');
      var hour = _.find(vm.data.hours, ['value', +id[0]]);
      $log.debug('on! id:', id);
    };


    var getHours = function(){
      var toPush, hours = _.range(9, 26, 0.5);
      vm.data.hours = [];
      _.each(hours, function(hour){
        toPush = {
          value: hour,
          hours: Math.floor(hour),
          text: hour + ':' + (hour * 10 % 10 === 0 ? '00' : '30'),
          minutes: hour * 10 % 10 === 0 ? 0 : 30,
          slots: {},
          matches: {},
          booked: {},
          status: 'free'
        };
        vm.data.hours.push(toPush);
      });
      _.each(vm.data.today.matches, function(match){
        var hour = match.startDate.hours;
        var minutes = match.startDate.minutes;
        var index = 0, tmpHour = 9, duration = 0;
        while (tmpHour !== hour) {
          tmpHour += 0.5;
          index += 1;
        }
        if (minutes !== 0) {
          index += 1;
        }
        vm.data.hours[index].matches[match.field] = match;
        while (duration < match.duration) {
          vm.data.hours[index].booked[match.field] = true;
          duration += 0.5;
          index += 1;
        }
      });
    };

    var fetchMatches = function(y) {
      var params = {}, year = y || vm.data.today.realDate.getFullYear();
      params.startDate = new Date(year, 0, 15);
      params.endDate = new Date(year, 12, 31);
      return MatchesService.fetchAll(params)
        .then(function(res){
          _.each(res, function(match){
            MatchesService.initDates(match);
            MatchesService.setStatus(match);
            MatchesService.setDuration(match, vm.data.durations);
          });
          vm.data.allMatches = res;
        });
    };
    
    var init = function() {
      vm.data.fields = vm.data.identity.five.fields;
      $rootScope.$broadcast('loading', true);
      Socket.emit('join five', vm.data.identity.five._id);
      fetchMatches().then(function(){
        $rootScope.$broadcast('loading', false);
      }, function(){
        $rootScope.$broadcast('loading', false);
      });
    };
    init();
  }
})();