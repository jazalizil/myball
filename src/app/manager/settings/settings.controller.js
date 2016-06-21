/**
 * Created by jazalizil on 15/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('SettingsController', SettingsController);
  /** @ngInject */
  function SettingsController(UserService, gettextCatalog, _, $log, CalendarService, $mdSidenav,
                              $document, toastr) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity(),
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
      fieldIndex: 0,
      photo: {},
      calendar: CalendarService.getDatas()
    };
    
    /*
    *  All tabs
    * */

    var cleanUpdate = function() {
      var equalities = {
        fields: angular.equals(vm.data.newIdentity.five.fields, vm.data.identity.five.fields),
        five: _.isEqual(vm.data.newIdentity.five, vm.data.identity.five),
        manager: _.isEqual(vm.data.newIdentity.manager, vm.data.identity.manager)
      }, ret = {}, toPush, i;
      $log.debug(vm.data.newIdentity.five.fields, '\n\n\n', vm.data.identity.five.fields);
      if (!equalities.fields) {
        ret.fields = [];
        for (i = 0; i < vm.data.newIdentity.five.fields.length; i += 1) {
          toPush = {};
          if (vm.data.newIdentity.five.fields[i].name !== vm.data.identity.five.fields[i].name) {
            toPush.name = vm.data.newIdentity.five.fields[i].name;
            if (vm.data.newIdentity.five.fields[i].available !== vm.data.identity.five.fields[i].available) {
              toPush.available = vm.data.newIdentity.five.fields[i].available;
            }
          }
          ret.fields.push(toPush)
        }
      }
      else if (!equalities.five) {
        ret.five = _.difference(vm.data.newIdentity.five, vm.data.identity.five);
        ret.five.days = [];
        for(i = 0; i < vm.data.newIdentity.five.days.length; i += 1) {
          if (!angular.equals(vm.data.newIdentity.five.days[i], vm.data.identity.five.days[i])) {
            ret.five.days.push(vm.data.newIdentity.five.days[i]);
          }
        }
      }
      else if (!equalities.manager) {
        ret.manager = _.difference(vm.data.newIdentity.manager, vm.data.identity.manager);
      }
      $log.debug('cleaned:', ret);
      return ret;
    };
    
    vm.update = function() {
      // var toSend = _.cloneDeep(vm.data.newIdentity);
      var toSend = cleanUpdate();
      vm.data.isLoading = true;
      return UserService.patch(toSend).then(function(res){
        vm.data.isLoading = false;
        // vm.data.identity.five = res;
        UserService.setIdentity(vm.data.newIdentity);
        toastr.success(gettextCatalog.getString('Paramètres mises à jour avec succès'));
        // vm.data.identity.photo = vm.data.newIdentity.photo;
        $log.debug(res);
      }, function(){
        toastr.error(gettextCatalog.getString('Un problème est survenu'), gettextCatalog.getString('Erreur'));
        vm.data.isLoading = false;
      });
    };
    
    /*
    *  Authorizations tab
    * */

    // Highlight hours
    vm.handleHours = function(hour, day) {
      var start = hour.value;
      var end = hour.value + 0.5;
      var el = angular.element($document[0].getElementById(day.number + 'd' + start));
      while (el.hasClass('closed')) {
        start -= 0.5;
        el = angular.element($document[0].getElementById(day.number + 'd' + start));
      }
      el = angular.element($document[0].getElementById(day.number + 'd' + end));
      while (el.hasClass('closed')) {
        end += 0.5;
        el = angular.element($document[0].getElementById(day.number + 'd' + end));
      }
      vm.data.authorization = {
        start: start,
        end: end - 0.5,
        day: day,
        hour: hour
      };
    };

    // // Unlight Hours
    // vm.leaveHours = function(el) {
    //   var hours = $document[0].getElementsByClassName('highlight');
    //   $log.debug('hours:', hours);
    //   _.each(hours, function(hour){
    //     var elem = angular.element(hour);
    //     elem.removeClass('highlight');
    //   })
    // };

    // Open Sidenvav
    vm.openSideNav = function(hour, day, offset) {
      if (hour) {
        vm.data.authorization = {
          start: hour.value,
          end: hour.value + offset,
          day: day,
          hour: hour,
          new: true
        }
      }
      vm.data.authorization.startInterval = [];
      var range = _.range(9, 22, 0.5);
      vm.data.authorization.endInterval = [];
      _.each(range, function(slot){
        var toPush = {
          value: slot,
          text: Math.ceil(slot) + 'h'
        };
        if (slot * 10 % 10 === 0) {
          toPush.text += '30';
        }
        vm.data.authorization.startInterval.push(toPush);
        vm.data.authorization.endInterval.push(toPush);
      });
      $mdSidenav('authorization').toggle();
    };

    // Update authorizations
    vm.updateAuthorizations = function() {
      var dayIdx = _.findIndex(vm.data.newIdentity.five.days, function(day){
        return day.day === vm.data.authorization.day.number;
      });
      _.remove(vm.data.newIdentity.five.days[dayIdx].hours, function(hours) {
        return hours.price === -1 && hours.from >= vm.data.authorization.start && hours.to <= vm.data.authorization.end
      });
      vm.data.newIdentity.five.days[dayIdx].hours.push({
        price: -1,
        from: vm.data.authorization.start,
        to: vm.data.authorization.end
      });
      initAuths();
      vm.data.isUploadingAuth = true;
      vm.update().then(function(){
        vm.data.isUploadingAuth = false;
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
      _.each(range, function(val) {
        var toPush = {
          value: val,
          closedDays: {}
        };
        if (val * 10 % 10 !== 0) {
          toPush.isHalf = true;
        }
        vm.data.hours.push(toPush);
      })
    };

    // Parse auth from identity.five.days
    var initAuths = function() {
      _.each(vm.data.newIdentity.five.days, function(day){
        var idx;
        _.each(day.hours, function(hour){
          if (hour.price === -1) {
            idx = _.findIndex(vm.data.hours, function(h){
              return h.value === hour.from;
            });
            if (idx == -1) {
              return;
            }
            vm.data.hours[idx].start = true;
            while (vm.data.hours[idx].value !== hour.to) {
              vm.data.hours[idx].closedDays[day.day] = true;
              idx += 1;
            }
          }
        })
      })
    };

    var init = function () {
      vm.data.welcomeSentence = gettextCatalog.getString('Bonjour') + ' ' + vm.data.identity.manager.firstName;
      vm.data.newIdentity = angular.copy(vm.data.identity);
      $log.debug(vm.data.newIdentity);
      vm.data.calendar.daysDisplayed.push(vm.data.calendar.daysDisplayed.shift());
      initHours();
      initAuths();
    };
    init();
  }
})();