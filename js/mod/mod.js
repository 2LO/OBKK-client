/** Deklaracja modułu */
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
    .config(function( $stateProvider
                    , $urlRouterProvider, $controllerProvider
                    , $compileProvider, $provide) {
        /** Używane w modułach */
        mod.cache = {
              controller: $controllerProvider.register
            , directive: $compileProvider.directive
            , service: $provide.service
            , factory: $provide.factory
        };

        /** Dynamiczne wczytywanie modułów */
        var modLoader = {
              templateUrl: function($stateParams) {
                return 'views/mod/' + $stateParams.name + '.html';
            }
            , controllerProvider: function ($q, $stateParams) {
                var ctrl = $stateParams.name + 'Ctrl';
                return ctrl.replace(/^(\w)/, function(c) {
                    return c.toUpperCase();
                });
            }
            , resolve: {
                /** Leniwe ładowanie modułów aplikacji */
                __load: function($q, $stateParams) {
                    var deferred = $q.defer();
                    require([ 
                        'mod/_/' + $stateParams.name
                    ], function(m) {
                        deferred.resolve();
                    });
                    return deferred.promise;
                }
            }
        };

        /** Routing dla strony głównej */
        $stateProvider
            /** Ekran błędu */
            .state('error', { 
                  url: '/error/:name'
                , templateUrl: function($stateParams) {
                    return 'views/error/' + $stateParams.name + '.html';
                }
            })
            /** Root moduł */
            .state('home', { 
                  url: '/home'
                , templateUrl: 'views/home/index.html'
                , abstract: true
                , controller: function($scope, Auth) {
                    $scope.modules = Auth.user.groups;
                }
                , data: {
                    anonymous: false
                }
            })
            /** Ekran modułu */
            .state('home.mod', { 
                  url: '/:name'
                , data: {
                    authorize: function(params) {
                        return { mods: [ params.name ] };
                    }
                }
                , views: {
                    'mod': modLoader
                }
            })
    });
    return mod;
});