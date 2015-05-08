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
            .state('register', { 
                  url: '/register'
                , templateUrl: 'views/register/index.html'
                , controller: 'RegisterCtrl'
                , abstract: true
                , data: {
                    anonymous: true
                }
            })
            .state('register.info', { 
                  url: ''
                , views: {'steps': {templateUrl: 'views/register/steps/info.html'}}
            })
            .state('register.confirm', { 
                  url: '/confirm'
                , views: {'steps': {templateUrl: 'views/register/steps/confirm.html'}}
            })
            /** Ekran logowania */
            .state('login', { 
                  url: '/login'
                , templateUrl: 'views/login/index.html'
                , controller: 'LoginCtrl'
                , data: {
                    anonymous: true
                }
            })
    });
    return mod;
});