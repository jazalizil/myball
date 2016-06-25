/**
 * Created by jazalizil on 20/06/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .factory('Socket', SocketFactory);
  /** @ngInject */
  function SocketFactory(Conf, $window, $rootScope) {
    var socket = $window.io.connect(Conf.WEBALL_API_BASE_URL, {
      secure: true
    });
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  }
})();