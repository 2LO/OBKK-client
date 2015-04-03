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
    /** Moduły */
    , 'register'
    , 'user'
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
        , 'ui.router'
        , 'underscore'
        , 'app.user'
        , 'app.register'
    ]);
    domReady(function(){
        angular.bootstrap(document, ['app']);
    });
    return app;
});