define([
	'angular'
], function(angular) {
	var mod = angular.module('app.register', []);
	mod.config(function($stateProvider, $urlRouterProvider) {
    	$urlRouterProvider.otherwise('/register');
    	$stateProvider
    		.state('register', {
    			url: '/register',
    			templateUrl: 'views/register/index.jade',
    			abstract: true
    		})
    		.state('register.info', {
		    	url: '',
		      	views: {
		      		'steps': {templateUrl: 'views/register/steps/info.jade'}
		      	}
		    })
		    .state('register.confirm', {
		    	url: '/confirm',
		      	views: {
		      		'steps': {templateUrl: 'views/register/steps/confirm.jade'}
		      	}
		    });
    });
	return mod;
});