/**
 * Created by jazalizil on 15/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .directive('contenteditable', ContentEditable);
  /** @ngInject */
  function ContentEditable($log, $document, $window) {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {
        // view -> model
        elm.bind('blur', function () {
          scope.$apply(function () {
            ctrl.$setViewValue(elm.html());
          });
        });
        elm.bind('keydow keypress', function(ev){
          if (ev.which === 13) {
            scope.$apply(function(){
              scope.$eval(attrs.ngEnter, {'event': ev});
            });
            ctrl.$setViewValue(elm.html());
            ev.target.blur();
            ev.preventDefault();
          }
        });
        elm.bind('focus', function(){
          elm[0].selectionEnd = elm.html().length;
          var sel = $window.getSelection();
          var range = $document[0].createRange();
          range.setStart(elm[0], 1);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        });

        // model -> view
        ctrl.$render = function () {
          elm.html(ctrl.$viewValue);
        };
      }
    };
  }
})();