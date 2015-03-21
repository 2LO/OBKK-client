/**
 * Uchwyt do modułu AngularJS, który
 * wykorzystują inne kontrolery, serwisy
 */
define([
			'domReady',
            'underscore',
            'angular',
            'ui-router',
            /** Moduły */
            'register'
        ], function(domReady, _, angular) {
    var app = angular.module('app', [
    	'ui.router',
        'app.register'
    ]);
    domReady(function(){
        angular.bootstrap(document, ['app']);
    });
    return app;
});