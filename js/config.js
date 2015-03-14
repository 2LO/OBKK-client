var require = {
    baseUrl:    'js',
    paths:      {
        'angular':   '../lib/angularjs/angular.min',
        'jquery':    '../lib/jquery/dist/jquery.min',
        'cryptojs':  '../lib/cryptojs/cryptojs',
        'underscore':'../lib/underscore/underscore-min'
    },
    map:  {
        '*': {
            'less':   '../lib/require-less/less',
            'css':    '../lib/require-css/css.min'
        }
    },
    shim:  {
        'angular':  {
            exports        :   'angular'
        },
        'jquery':  {
            exports: 'jquery'
        },
        'underscore':    {
            exports: '_'
        },
        'bootstrap':    { 
            'deps': ['jquery'] 
        },
        'bootbox':    { 
            'deps': ['bootstrap'] 
        }
    },
    priority: [
        'angular',
        'angular_route'
    ]
};
