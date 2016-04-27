/**
 * Created by jazalizil on 21/04/2016.
 */

(function () {
  'use strict';

  angular.module('myBall')
    .service('AmazoneS3', AmazoneS3);
  /** @ngInject */
  function AmazoneS3(Conf, CryptoJs, Restangular, $q) {
    return {
      upload: function(file, where) {
        var deferred = $q.defer();
        var authorization = 'AWS ' + Conf.AMAZONE_S3_API_ACCESS_KEY + ':';
        var now = new Date().toUTCString();
        var md5 = CryptoJs.enc.Base64.stringify(CryptoJs.MD5(file.data));
        var message = 'PUT\n' +
          md5 + '\n' +
          file.type + '\n\n' +
          'x-amz-acl:public-read\n' +
          'x-amz-date:' + now + '\n' +
          '/' + Conf.AMAZONE_S3_BUCKET + where + file.name;
        var signature = CryptoJs.enc.Base64.stringify(CryptoJs.HmacSHA1(message.toString(CryptoJs.enc.Utf8),
          Conf.AMAZONE_S3_API_SECRET_KEY));
        authorization += signature;
        Restangular.withConfig(function(RestangularConfigurer){
          RestangularConfigurer.setBaseUrl(Conf.AMAZONE_S3_API_BASE_URL);
          RestangularConfigurer.setDefaultHeaders({
            'Authorization': authorization,
            'x-amz-date': now,
            'Content-Type': file.type,
            'Content-MD5': md5,
            'x-amz-acl': 'public-read',
            'Content-Length': file.data.length
          })
        }).one('media/' + where + file.name).customPUT(file.data).then(function(){
          deferred.resolve(Conf.CDN_BASE_URL + where + file.name);
        }, function(){
          deferred.reject('Upload error');
        });
        return deferred.promise;
      }
    }
  }
})();