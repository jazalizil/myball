/**
 * Created by jazalizil on 20/06/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .factory('Socket', SocketFactory);
  /** @ngInject */
  function SocketFactory(Conf, socketFactory, $window) {
    var socket = $window.io.connect(Conf.WEBALL_API_BASE_URL, {
      secure: true
    });
    return socketFactory({
      ioSocket: socket
    });
  }
})();