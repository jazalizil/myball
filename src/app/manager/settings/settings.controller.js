/**
 * Created by jazalizil on 15/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('SettingsController', SettingsController);
  /** @ngInject */
  function SettingsController(UserService, gettextCatalog, _, $log, CalendarService, $mdSidenav,
                              toastr, $scope, $stateParams, $state) {
    var vm = this;
    vm.data = {
      labels: {
        manager: gettextCatalog.getString('Manager'),
        five: gettextCatalog.getString('Five'),
        availibilities: gettextCatalog.getString('Disponibilités'),
        email: gettextCatalog.getString('Adresse mail'),
        oldPassword: gettextCatalog.getString('Ancien mot de passe'),
        newPassword: gettextCatalog.getString('Nouveau mot de passe'),
        phone: gettextCatalog.getString('Numéro de téléphone'),
        fiveName: gettextCatalog.getString('Nom du five'),
        fieldName: gettextCatalog.getString('Nom du terrain'),
        available: gettextCatalog.getString('Disponible'),
        authorizations: gettextCatalog.getString('Autorisations'),
        endAt: gettextCatalog.getString('Heure de fin'),
        startFrom: gettextCatalog.getString('Heure de début'),
        price: gettextCatalog.getString('Prix')
      },
      sentences: [
        gettextCatalog.getString('Modifier vos informations personnelles.'),
        gettextCatalog.getString('Modifier les informations de votre five.'),
        gettextCatalog.getString('Gérer les autorisations weBall'),
        gettextCatalog.getString('Modifier les informations de vos terrains.')
      ],
      availibilitiesChoices: [
        gettextCatalog.getString('Indisponibilités'),
        gettextCatalog.getString('Disponibilités')
      ],
      patch: {},
      photo: {},
      calendar: CalendarService.getDatas(),
      startInterval: [],
      endInterval: []
    };
    
    /*
    *  All tabs
    * */

    // selected tab in url
    $scope.$watch(function(){
      return vm.data.selectedTab;
    }, function(newVal){
      if (newVal) {
        $stateParams.tab = newVal;
      } else {
        delete $stateParams.tab;
      }
      $state.transitionTo($state.current, $stateParams, {
        reload: false, inherit: false, notify: false
      });
    });

    // WIP photo
    var computePatchFive = function(patch) {
      if (vm.data.newIdentity.five.phone !== vm.data.identity.five.phone) {
        patch.five.phone = vm.data.newIdentity.five.phone;
      }
      if (vm.data.newIdentity.five.name !== vm.data.identity.five.name) {
        patch.five.name = vm.data.newIdentity.five.name;
      }
      if (vm.data.newIdentity.five.photo !== vm.data.identity.five.photo) {
        patch.five.photo = vm.data.newIdentity.five.photo;
      }
    };

    var computePatchFields = function(patch) {
      for (var idx = 0; idx < vm.data.newIdentity.five.fields.length; idx += 1) {
        if (vm.data.newIdentity.five.fields[idx].name !== vm.data.identity.five.fields[idx].name ||
          vm.data.newIdentity.five.fields[idx].available !== vm.data.identity.five.fields[idx].available) {
          patch.fields.push({
            _id : vm.data.newIdentity.five.fields[idx]._id,
            available: vm.data.newIdentity.five.fields[idx].available,
            name: vm.data.newIdentity.five.fields[idx].name
          });
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
      computePatchFive(patch);
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
    *  Availibilities tab
    * */

    vm.deleteException = function() {
      vm.data.exceptionDate = null;
    }


    /*
    *  Authorizations tab
    * */

    // Open Sidenvav
    vm.openSideNav = function(hour, day) {
      vm.data.authorization = hour.auths[day.number] || {
          from: hour.value,
          to: hour.value + 0.5,
          day: day,
          price: 8,
          hour: hour,
          errors: {},
          isNew: true
        };
      var idAuth = _.find(vm.data.identity.five.days, ['day', day.number]);
      vm.data.oldAuth = angular.copy(_.find(idAuth.hours, ['from', hour.value]));
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
      if (vm.data.oldAuth) {
        _.remove(day.hours, function(hour) {
          return hour.to === vm.data.oldAuth.to && hour.from === vm.data.oldAuth.from;
        });
      }
      $log.debug('patched id:', vm.data.newIdentity);
      day.hours.push({
        price: vm.data.authorization.price,
        from: vm.data.authorization.from,
        to: vm.data.authorization.to
      });
      vm.data.isUploadingAuth = true;
      vm.update().then(function(){
        vm.data.isUploadingAuth = false;
        delete vm.data.authorization.isNew;
        initHours();
        initAuths();
        $mdSidenav('authorization').close();
      }, function(){
        vm.data.isUploadingAuth = false;
      });
    };

    // Add auth to display
    // var addAuthToDisplay = function(hour) {
    //   vm.data.authorization.duration = vm.data.authorization.to - vm.data.authorization.from;
    //   hour.auths[vm.data.authorization.day.number] = vm.data.authorization;
    //   var duration = 0.5;
    //   var idx = _.findIndex(vm.data.hours, ['value', vm.data.authorization.from]);
    //   while (duration < vm.data.authorization.duration) {
    //     vm.data.hours[idx].booked[vm.data.authorization.day.number] = true;
    //     duration += 0.5;
    //     idx += 1;
    //   }
    // };

    // Delete auth to display
    var deleteAuthToDisplay = function(hour) {
      delete hour.auths[vm.data.authorization.day.number];
      var idx = _.findIndex(vm.data.hours, ['value', vm.data.authorization.from]);
      var duration = 0.5;
      while (duration < vm.data.authorization.duration) {
        vm.data.hours[idx].booked[vm.data.authorization.day.number] = false;
        duration += 0.5;
        idx += 1;
      }
    };

    // Delete authorization
    vm.deleteAuthorization = function() {
      var day = _.find(vm.data.newIdentity.five.days, ['day', vm.data.authorization.day.number]);
      _.remove(day.hours, function(hours) {
        return hours.from >= vm.data.authorization.from && hours.to <= vm.data.authorization.to
      });
      vm.data.isDeletingAuth = true;
      vm.update().then(function(){
        deleteAuthToDisplay(vm.data.selectedHour);
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
          var tmp, auth, duration, idx, to;
          if (hour.price !== -1) {
            idx = _.findIndex(vm.data.hours, function(h){
              return h.value === hour.from;
            });
            if (idx < 0) {
              return;
            }
            tmp = vm.data.hours[idx];
            to = hour.to < 22 ? hour.to : 22;
            auth = {
              from: hour.from,
              price: hour.price,
              to: to,
              duration: to - hour.from,
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
      vm.data.selectedTab = $stateParams.tab;
      UserService.identity(true).then(function(identity){
        vm.data.identity = identity;
        vm.data.newIdentity = angular.copy(vm.data.identity);
        vm.data.welcomeSentence = gettextCatalog.getString('Bonjour') + ' ' + vm.data.identity.manager.firstName;
        vm.data.calendar.daysDisplayed.push(vm.data.calendar.daysDisplayed.shift());
        vm.data.selectedField = vm.data.newIdentity.five.fields[0];
        vm.data.availibilityChoice = vm.data.availibilitiesChoices[0];
        initHours();
        initAuths();
        createDisplayInterval();
      })
    };
    init();
  }
})();