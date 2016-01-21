/**
 * Created by jazalizil on 20/12/15.
 */

(function () {
  'use strict';

  angular.module('myBall')
    .directive('fieldScheduler', fieldScheduler);

  function fieldScheduler() {
    /** @ngInject */
    function fieldSchedulerController($scope, $log, FieldsService, _, CalendarService) {
      var vm = this;
      vm.data = _.merge(FieldsService.getDatas(), CalendarService.getDatas());

      $scope.$on('angular-resizable.resizing', function(event, args){
        $log.debug(args, ' ', event);

      });
    }

    return {
      restrict: 'E',
      scope: {
        field: '='
      },
      controller: fieldSchedulerController,
      controllerAs: 'vm',
      templateUrl: 'app/manager/components/fields/field-scheduler.tpl.html',
      link: function(scope, element) {
        scope.$on('angular-resizable.resizing', function(event, args){
          var elem = element.find('#' + args.id);
          elem.children().css('margin-top', elem.height - 10);
        })
      }
    }
  }
})();