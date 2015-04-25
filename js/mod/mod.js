define([
    'angular'
], function(
    angular
) {
    var mod = angular.module('app.mod', []);
    mod
    /** Konfiguracja routingu */
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            /** Root moduł */
            .state('home'
                , { url: '/home'
                , templateUrl: 'views/home/index.html'
                , abstract: true
            })
            /** Ekran modułu */
            .state('home.mod'
                , { url: '/mod/:name'
                , templateUrl: function($stateParams) {
                    return 'views/mod/'+$stateParams.name+'.html';
                }
            })
    });
    return mod;
});