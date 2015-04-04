/**
 * Uchwyt do modułu AngularJS, który
 * wykorzystują inne kontrolery, serwisy
 */
define([
      'domReady'
    , 'angular'
    , 'underscore'
    , 'ui-router'
    , 'angular-res'
    , 'ng-storage'
    /** Moduły */
    , 'auth'
], function(
      domReady
    , angular
) {
    /** Underscore deklarowany globalnie */
    var underscore = angular.module('underscore', []);
    underscore.factory('_', function() {
        return window._;
    });

    var app = angular.module('app', [
          'ngResource'
        , 'ngStorage'
        , 'ui.router'
        , 'underscore'
        , 'app.auth'
    ]);
    domReady(function(){
        angular.bootstrap(document, ['app']);
    });
    return app;
});