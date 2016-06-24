/**
 * Created by jazalizil on 15/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('SettingsController', SettingsController);
  /** @ngInject */
  function SettingsController(UserService, gettextCatalog, _, $log, CalendarService, $mdSidenav,
                              toastr) {
    var vm = this;
    vm.data = {
      labels: {
        manager: gettextCatalog.getString('Manager'),
        five: gettextCatalog.getString('Five'),
        fields: gettextCatalog.getString('Terrains'),
        email: gettextCatalog.getString('Adresse mail'),
        oldPassword: gettextCatalog.getString('Ancien mot de passe'),
        newPassword: gettextCatalog.getString('Nouveau mot de passe'),
        phone: gettextCatalog.getString('Numéro de téléphone'),
        fiveName: gettextCatalog.getString('Nom du five'),
        fieldName: gettextCatalog.getString('Nom du terrain'),
        available: gettextCatalog.getString('Disponible'),
        authorizations: gettextCatalog.getString('Autorisations'),
        endAt: gettextCatalog.getString('Heure de fin'),
        startFrom: gettextCatalog.getString('Heure de début')
      },
      sentences: [
        gettextCatalog.getString('Modifier vos informations personnelles.'),
        gettextCatalog.getString('Modifier les informations de votre five.'),
        gettextCatalog.getString('Gérer les autorisations weBall'),
        gettextCatalog.getString('Modifier les informations de vos terrains.')
      ],
      patch: {},
      fieldIndex: 0,
      photo: {},
      calendar: CalendarService.getDatas(),
      startInterval: [],
      endInterval: []
    };
    
    /*
    *  All tabs
    * */

    // WIP photo
    var computeFivePatch = function(patch) {
      if (vm.data.newIdentity.five.phone !== vm.data.identity.five.phone) {
        patch.five.phone = vm.data.newIdentity.five.phone;
      }
      if (vm.data.newIdentity.five.name !== vm.data.identity.five.name) {
        patch.five.name = vm.data.newIdentity.five.name;
      }
    };

    var computePatchFields = function(patch) {
      for (var idx = 0; idx < vm.data.newIdentity.five.fields.length; idx += 1) {
        if (vm.data.newIdentity.five.fields[idx].name !== vm.data.identity.five.fields[idx].name ||
          vm.data.newIdentity.five.fields[idx].available !== vm.data.identity.five.fields[idx].available) {
          patch.fields.push({
            available: vm.data.newIdentity.five.fields[idx].available,
            name: vm.data.newIdentity.five.fields[idx].name
          });
        } else {
          patch.fields.push({});
        }
      }
    };

    var computePatchManager = function(patch) {
      if (vm.data.newIdentity.manager.email !== vm.data.identity.manager.email) {
        patch.manager.email = vm.data.newIdentity.manager.email;
      }
      if (vm.data.newIdentity.manager.password !== vm.data.identity.manager.password) {
        patch.manager.password = vm.data.newIdentity.manager.password;
      }
    };

    var computePatch = function() {
      var patch = {
        five: {
          days: vm.data.newIdentity.five.days
        },
        fields: [],
        manager: {}
      };
      computeFivePatch(patch);
      computePatchFields(patch);
      computePatchManager(patch);
      return patch;
    };
    
    vm.update = function() {
      // var toSend = _.cloneDeep(vm.data.newIdentity);
      var toSend = computePatch();
      $log.debug('new id:', vm.data.newIdentity);
      vm.data.isLoading = true;
      return UserService.patch(toSend).then(function(){
        vm.data.isLoading = false;
        // vm.data.identity.five = res;
        UserService.setIdentity(vm.data.newIdentity);
        toastr.success(gettextCatalog.getString('Paramètres mises à jour avec succès'));
        // vm.data.identity.photo = vm.data.newIdentity.photo;
      }, function(){
        toastr.error(gettextCatalog.getString('Un problème est survenu'), gettextCatalog.getString('Erreur'));
        vm.data.isLoading = false;
      });
    };
    
    /*
    *  Authorizations tab
    * */

    // Open Sidenvav
    vm.openSideNav = function(hour, day) {
      vm.data.authorization = hour.auths[day.number] || {
          from: hour.value,
          to: hour.value + 0.5,
          day: day,
          hour: hour,
          errors: {},
          isNew: true
        };
      $log.debug('auth:', vm.data.authorization);
      vm.data.selectedHour = hour;
      $mdSidenav('authorization').open();
    };

    // Update authorizations
    vm.updateAuthorizations = function() {
      if (vm.data.authorization.from > vm.data.authorization.to) {
        vm.data.authorization.errors.from = true;
        return;
      } else if (vm.data.authorization + 0.5 > vm.data.authorization.to) {
        vm.data.authorization.errors.to = true;
        return;
      }
      var day = _.find(vm.data.newIdentity.five.days, ['day', vm.data.authorization.day.number]);
      _.remove(day.hours, function(hours) {
        return hours.price === -1 && hours.from >= vm.data.authorization.from && hours.to <= vm.data.authorization.to
      });
      $log.debug('patched id:', vm.data.newIdentity);
      day.hours.push({
        price: -1,
        from: vm.data.authorization.from,
        to: vm.data.authorization.to
      });
      vm.data.isUploadingAuth = true;
      vm.update().then(function(){
        vm.data.isUploadingAuth = false;
        initAuths();
        $mdSidenav('authorization').close();
      }, function(){
        vm.data.isUploadingAuth = false;
      });
    };

    // Delete authorization
    vm.deleteAuthorization = function() {
      var dayIdx = _.findIndex(vm.data.newIdentity.five.days, function(day){
        return day.day === vm.data.authorization.day.number;
      });
      _.remove(vm.data.newIdentity.five.days[dayIdx].hours, function(hours) {
        return hours.from >= vm.data.authorization.start && hours.to <= vm.data.authorization.end
      });
      initAuths();
      vm.data.isDeletingAuth = true;
      vm.update().then(function(){
        vm.data.isDeletingAuth = false;
        $mdSidenav('authorization').close();
      }, function(){
        vm.data.isDeletingAuth = false;
      });
    };

    // Create auth cells
    var initHours = function() {
      var range = _.range(9, 23, 0.5);
      vm.data.hours = [];
      _.each(range, function(hour) {
        var toPush = {
          value: hour,
          text: hour + ':' + (hour * 10 % 10 === 0 ? '00' : '30'),
          booked: {},
          auths: {},
          errors: {},
          isHalf: hour * 10 % 10 !== 0
        };
        vm.data.hours.push(toPush);
      });
      $log.debug(vm.data.hours);
    };

    // Create display intervals
    var createDisplayInterval = function() {
      var range = _.range(9, 22.5, 0.5);
      _.each(range, function(slot){
        var toPush = {
          value: slot,
          text: Math.floor(slot) + 'h'
        };
        if (slot * 10 % 10 !== 0) {
          toPush.text += '30';
        }
        vm.data.startInterval.push(toPush);
        vm.data.endInterval.push(toPush);
      });
    };

    // Parse auth from identity.five.days
    var initAuths = function() {
      _.each(vm.data.newIdentity.five.days, function(day){
        _.each(day.hours, function(hour){
          var tmp, auth, duration, idx;
          if (hour.price === -1) {
            idx = _.findIndex(vm.data.hours, function(h){
              return h.value === hour.from;
            });
            if (idx < 0) {
              return;
            }
            tmp = vm.data.hours[idx];
            tmp.booked[day.day] = true;
            auth = {
              from: hour.from,
              to: hour.to,
              duration: hour.to - hour.from,
              day: _.find(vm.data.calendar.daysDisplayed, ['number', day.day])
            };
            duration = 0.5;
            while (duration < auth.duration && vm.data.hours[idx].value < 22) {
              vm.data.hours[idx].booked[day.day] = true;
              duration += 0.5;
              idx += 1;
            }
            tmp.auths[day.day] = auth;
          }
        })
      })
    };

    var init = function () {
      UserService.identity(true).then(function(identity){
        vm.data.identity = identity;
        vm.data.newIdentity = angular.copy(vm.data.identity);
        vm.data.welcomeSentence = gettextCatalog.getString('Bonjour') + ' ' + vm.data.identity.manager.firstName;
        vm.data.newIdentity = angular.copy(vm.data.identity);
        vm.data.calendar.daysDisplayed.push(vm.data.calendar.daysDisplayed.shift());
        initHours();
        initAuths();
        createDisplayInterval();
      })
    };
    init();
  }
})();