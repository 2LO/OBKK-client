var require = {
    baseUrl:    'js',
    paths:      {
        'angular':   '../lib/angularjs/angular.min',
        'jquery':    '../lib/jquery/dist/jquery.min',
        'cryptojs':  '../lib/cryptojs/cryptojs',
        'underscore':'../lib/underscore/underscore-min',
        'semantic':  '../lib/semantic-ui/dist/semantic.min'
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
            exports        :   'angular'
        },
        'jquery':  {
            exports: 'jquery'
        },
        'underscore':    {
            exports: '_'
        }
    },
    priority: [
        'angular',
        'angular_route'
    ]
};
