/**
 * Uchwyt do modułu AngularJS, który
 * wykorzystują inne kontrolery, serwisy
 */
define([
			'domReady',
            'underscore',
            'angular',
            'ui-router',
            'angular-res',
            /** Moduły */
            'register',
            'user',
        ], function(domReady, _, angular) {
    var app = angular.module('app', [
    	'ngResource',
    	'ui.router',
        'app.user',
        'app.register'
    ]);
    domReady(function(){
        angular.bootstrap(document, ['app']);
    });
    return app;
});