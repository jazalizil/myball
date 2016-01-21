/**
 * Created by jazalizil on 19/01/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .directive('mbCarousel', mbCarousel);
  /** @ngInject */
  function mbCarousel($interval) {
    function mbCarouselController() {
      var vm = this;
      vm.index = 0;
      vm.currentImg = vm.imgs[vm.index];
    }
    function mbCarouselLink(scope, el){
      var timeOut = +scope.carousel.timeout || 3000, timeOutPr;
      function nextImg() {
        scope.carousel.index += 1;
        if (typeof scope.carousel.imgs[scope.carousel.index] === 'undefined') {
          scope.carousel.index = 0;
        }
        scope.carousel.currentImg = scope.carousel.imgs[scope.carousel.index];
      }
      timeOutPr = $interval(function(){
        nextImg();
      }, timeOut);
      el.on('$destroy', function(){
        $interval.cancel(timeOutPr);
      });
    }
    return {
      restrict: 'E',
      templateUrl: 'app/common/components/carousel/mbCarousel.html',
      scope: {
        imgs: '=',
        timeout: '@'
      },
      link: mbCarouselLink,
      controller: mbCarouselController,
      controllerAs: 'carousel',
      bindToController: true
    }
  }
})();