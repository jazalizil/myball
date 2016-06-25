(function() {
  'use strict';

  angular
    .module('myBall')
    .config(config);

  /** @ngInject */
  function config($provide, $logProvider, toastrConfig, RestangularProvider, Conf, $mdThemingProvider,
                  localStorageServiceProvider, $mdIconProvider, $sceDelegateProvider) {
    // Enable log if environment allows it
    $logProvider.debugEnabled(false);
    if (Conf.DEBUG) {
      $logProvider.debugEnabled(true);
    }

    // Register Fontawesome icons
    //$mdIconProvider.iconSet('fa', '../../bower_components/font-awesome/fonts/fontawesome-webfont.svg');
    $mdIconProvider.fontSet('fa', 'FontAwesome');

    // Set CORS
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      Conf.AMAZONE_S3_API_BASE_URL + '**'
    ]);


    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = true;

    RestangularProvider.setBaseUrl(Conf.WEBALL_API_BASE_URL);

    var wbPrimaryPalette = $mdThemingProvider.extendPalette('green', {
      '500': '7ed321'
    });
    var wbAccentPalette = $mdThemingProvider.extendPalette('grey', {
      //'500': '1A1C23',
      //'hue-2': 'CCCCCC',
      'default': '900'
    });
    $mdThemingProvider.definePalette('wbPrimaryPalette', wbPrimaryPalette);
    $mdThemingProvider.definePalette('wbAccentPalette', wbAccentPalette);
    $mdThemingProvider.theme('default')
      .primaryPalette('wbPrimaryPalette')
      .accentPalette('wbAccentPalette');

    localStorageServiceProvider.setPrefix('wb');

  }

})();
