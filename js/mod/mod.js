define([
    'angular'
], function(
    angular
) {
    var mod = angular.module('app.mod', []);
    mod
    .constant('ERROR_CODE', {
        'unauthorized': 401
    })
    /** Konfiguracja routingu */
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            /** Ekran błędu */
            .state('error', { 
                  url: '/error/:name'
                , templateUrl: function($stateParams) {
                    return 'views/error/'+$stateParams.name+'.html';
                }
            })
            /** Root moduł */
            .state('home', { 
                  url: '/home'
                , templateUrl: 'views/home/index.html'
                , abstract: true
            })
            /** Ekran modułu */
            .state('home.mod', { 
                  url: '/mod/:name'
                , templateUrl: function($stateParams) {
                    return 'views/mod/'+$stateParams.name+'.html';
                }
            })
    });
    return mod;
});