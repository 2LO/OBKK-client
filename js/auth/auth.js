define([
    'angular'
], function(
    angular
) {
    var mod = angular.module('app.auth', []);
    mod
    /** Konfiguracja routingu */
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            /** Ekran rejestracji */
            .state( 'register'
                  , { url: '/register'
                    , templateUrl: 'views/register/index.html'
                    , abstract: true
                    })
            .state( 'register.info'
                  , { url: ''
                    , views: {'steps': {templateUrl: 'views/register/steps/info.html'}}
                    })
            .state( 'register.confirm'
                  , { url: '/confirm'
                    , views: {'steps': {templateUrl: 'views/register/steps/confirm.html'}}
                    })
            /** Ekran logowania */
            .state( 'login'
                  , { url: '/login'
                    , templateUrl: 'views/login/index.html'
                    })
    });
    return mod;
});