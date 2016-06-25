/**
 * Created by jazalizil on 21/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .directive('mbFileInput', mbFileInput);
  /** @ngInject */
  function mbFileInput(Utils) {
    return {
      restrict: 'E',
      transclude: true,
      link: function(scope, elm) {
        elm.bind('change', function(ev) {
          var file = ev.target.files[0];
          if (!file) {
            return;
          }
          if (file.type.startsWith('image')) {
            scope.loading = true;
            var image = angular.element('<img style="display:none">')[0];
            var canvas = angular.element('<canvas style="display:none"></canvas>')[0];
            scope.$apply(function(){
              Utils.getB64(file).then(function(res){
                var context = canvas.getContext('2d');
                var maxWidth = 1920, maxHeight = 1080, width, height;
                image.onload = function() {
                  scope.$apply(function(){
                    height = image.height;
                    width = image.width;
                    if (width > height) {
                      if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                      }
                    }
                    else {
                      if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                      }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    context.drawImage(image, 0, 0, width, height);
                    scope.file = canvas.toDataURL(file.type);
                    scope.name = file.name;
                    scope.loading = false;
                    image.remove();
                    canvas.remove();
                  });
                };
                image.src = res;
              });
            });
          }
          else {
            scope.file = file;
          }
        })
      },
      scope: {
        file: '=',
        name: '=',
        maxSize: '=',
        loading: '='
      },
      templateUrl: 'app/common/components/core/mbFileInput.tpl.html',
      controllerAs: 'fileInput',
      replace: true
    }
  }
})();