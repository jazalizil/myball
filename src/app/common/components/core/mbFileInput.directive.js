/**
 * Created by jazalizil on 21/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .directive('mbFileInput', mbFileInput);
  /** @ngInject */
  function mbFileInput($log) {
    return {
      restrict: 'E',
      transclude: true,
      link: function(scope, elm) {

        function readFile(file) {
          var reader = new FileReader();
          reader.onload = function(ev){
            scope.$apply(function() {
              $log.debug(ev.target);
              scope.file.result = ev.target.result;
              scope.file.type = file.type;
              scope.file.name = file.name;
              if (file.type.startsWith('image')) {
                scope.file.src = scope.file.result;
              }
              scope.loading = false;
            })
          };
          reader.onloadstart = function() {
            scope.$apply(function(){
              scope.loading = true;
            })
          };
          reader.readAsBinaryString(file);
        }

        elm.bind('change', function(ev) {
          var file = ev.target.files[0];
          if (!file) {
            return;
          }
          readFile(file);
        })
      },
      scope: {
        file: '=',
        maxSize: '=',
        loading: '='
      },
      templateUrl: 'app/common/components/core/mbFileInput.tpl.html',
      controllerAs: 'fileInput',
      replace: true
    }
  }
})();