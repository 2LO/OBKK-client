var require = {
    packages:   [
        'register'
    ],
    paths:      {
        'angular':   '../lib/angularjs/angular.min',
        'ui-router': '../lib/angular-ui-router/release/angular-ui-router.min',
        'jquery':    '../lib/jquery/dist/jquery.min',
        'cryptojs':  '../lib/cryptojs/cryptojs',
        'underscore':'../lib/underscore/underscore-min',
        'semantic':  '../lib/semantic-ui/dist/semantic.min',
        'domReady':  '../lib/domReady/domReady'
    },
    map:  {
        '*': {
            'less':   '../lib/require-less/less',
            'css':    '../lib/require-css/css.min'
        }
    },
    shim:  {
        'semantic': {
            exports: 'semantic',
            deps: ['jquery']
        },
        'angular':  {
            exports:   'angular'
        },
        'jquery':  {
            exports: 'jquery'
        },
        'underscore':    {
            exports: '_'
        },
        'ui-router': ['angular']
    }
};
