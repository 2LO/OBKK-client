var require = {
    packages: [
          'auth'
        , 'mod'
    ]
    , paths: {
          'angular': '../lib/angularjs/angular.min'
        , 'angular-res': '../lib/angular-resource/angular-resource.min'
        , 'ui-router': '../lib/angular-ui-router/release/angular-ui-router.min'
        , 'jquery': '../lib/jquery/dist/jquery.min'
        , 'cryptojs': '../lib/cryptojs/cryptojs'
        , 'underscore': '../lib/underscore/underscore-min'
        , 'domReady': '../lib/domReady/domReady'
        , 'semantic': '../lib/semantic/dist/semantic.min'
        , 'ng-storage': '../lib/ngstorage/ngStorage.min'
        , 'loading-bar': '../lib/angular-loading-bar/build/loading-bar.min'
    }
    , map: {
        '*': {
            'less': '../lib/require-less/less'
            , 'css': '../lib/require-css/css.min'
        }
    }
    , shim: {
        'angular': {
            exports: 'angular'
        }
        , 'jquery': {
            exports: 'jquery'
        }
        , 'underscore': {
            exports: '_'
        }
        , 'ui-router': ['angular']
        , 'angular-res': ['angular']
        , 'ng-storage': ['angular']
        , 'loading-bar': ['angular']
        , 'semantic': ['jquery']
    }
};