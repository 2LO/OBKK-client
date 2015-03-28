define([
	'angular',
	'underscore'
], function(angular, _) {
	var mod = angular.module('app.register', []);
	mod
		/** Konfiguracja routingu */
		.config(function($stateProvider, $urlRouterProvider) {
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
	    })
	    /** Automatyczne wstawianie znaków do string */
	    .directive('ngPlaceholder', function() {
	    	var matchPattern = function(pattern, elem, val) {
	    		if(typeof val === 'undefined')
	    			return;
	    		/** Automatyczne przeskakiwanie do szablonu */
	    		var index = val.length,
	    			c 	  = val[index-1];

	    		if(index != 0 && pattern[index-1] === c)
	    			val = val.substr(0, index-1);
	    		else if(pattern[index] !== 'C' && !/^\d$/.test(c))
	    			val = '';
	    		else if(index < pattern.length && !/^[CD]$/.test(pattern[index]))
	    			val += pattern[index];
	    		elem.val(val);
	    	}
			return {
			    restrict: 'A',
			    link: function(scope, elem, attr) {
			    	var placeholder = attr.ngPlaceholder;
			    	elem.attr('placeholder', placeholder);
			    	scope.$watch(
			    		attr.ngModel, 
			    		_.bind(matchPattern, this, placeholder, elem));
			    }
		  	}
		});
	return mod;
});