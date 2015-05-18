/** Deklaracja modułu */
define([
      'underscore'
    , 'angular'
], function(
      _
    , angular
) {
    var mod = angular.module('app.mod', []);
    mod
    .constant('ERROR_CODE', {
        'unauthorized': 401
    })
    /** Tworzenie nowych stanów podczas działania aplikacji */
    .provider('runtimeStates', function runtimeStates($stateProvider) {
        this.$get = function($q, $timeout, $state) {
            return { 
                addState: function(name, state) {
                    $stateProvider.state(name, state);
                }
            };
        }
    })
    /** Konfiguracja routingu */
    .config(function( $stateProvider
                    , $urlRouterProvider, $controllerProvider
                    , $compileProvider, $provide) {
        /** Używane w modułach */
        mod.api = _({
              controller: $controllerProvider.register
            , directive: $compileProvider.directive
            , service: $provide.service
            , factory: $provide.factory
            , state: $stateProvider.state
        }).fluent();

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
                        'mod/js/' + $stateParams.name
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
                , data: { anonymous: false }
            })
            /** Ekran modułu */
            .state('home.mod', { 
                  url: '/:name'
                , data: {
                    authorize: function(params) {
                        return { mods: [ params.name ] };
                    }
                }
                , views: { 'mod': modLoader }
            })
    });
    return mod;
});
