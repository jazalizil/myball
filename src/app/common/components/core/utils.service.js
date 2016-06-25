/**
 * Created by jazalizil on 29/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .service('Utils', Utils);
  /** @ngInject */
  function Utils($q) {
    return {
      getB64 : function(image) {
        var reader = new FileReader();
        var deferred = $q.defer();
        reader.onload = function(ev){
          deferred.resolve('data:' + image.type + ';base64,' + btoa(ev.target.result));
        };
        reader.readAsBinaryString(image);
        return deferred.promise;
      },
      drawImage : function(context, b64) {
        var image = new Image();
        var deferred = $q.defer();
        image.onload = function(){
          context.drawImage(image, 0, 0);
          deferred.resolve({
            ctx: context,
            width: image.width,
            height: image.height
          });
        };
        image.src = b64;
        return deferred.promise;
      }
    }
  }
})();