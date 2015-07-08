/// <reference path="./_all.ts" />
/// <reference path="./shared/_all.ts" />

'use strict';

module Application {
    function config(
          $stateProvider: ng.ui.IStateProvider
        , $urlRouterProvider: ng.ui.IUrlRouterProvider
    ) {
        // $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                  url: '/login'
                , templateUrl: 'views/login.html'
                , controller: 'LoginCtrl'
            })
            .state('register', {
                  url: '/register'
                , abstract: true
                , controller: 'RegistrationCtrl'
                , template: '<div ui-view>'
            })
            .state('register.complete', {
                  url: '/complete?id&orders'
                , templateUrl: 'views/registrationComplete.html'
            })
            .state('register.request', {
                  url: '/request'
                , templateUrl: 'views/registration.html'
            });
    };

    let coreMods = [
          'ui.router'
        , 'ngResource'
        , 'ngStorage'
        , 'ngAnimate'
        , 'shared'
    ];
    angular
        .module('app', coreMods)
        .config(config);
};
(() => {
    angular
        .element(document)
        .ready(angular.bootstrap.bind(null, document, [ 'app' ]));
})();
