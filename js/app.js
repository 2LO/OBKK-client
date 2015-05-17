/**
 * Uchwyt do modułu AngularJS, który
 * wykorzystują inne kontrolery, serwisy
 */
define([
      'angular'
    , 'ui-router'
    , 'angular-res'
    , 'ng-storage'
    , 'loading-bar'
    /** Moduły */
    , 'auth'
    , 'mod'
], function(
    angular
) {
    var app = angular.module('app', [
          'ngResource'
        , 'ngStorage'
        , 'angular-loading-bar'
        , 'ui.router'
        , 'app.auth'
        , 'app.mod'
    ]);
    app.config(function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.latencyThreshold = 100;
    });
    return app;
});
