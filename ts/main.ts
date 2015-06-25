/// <reference path="./_all.ts" />
/// <reference path="./shared/_all.ts" />

'use strict';
module Application {
    function config(
          $stateProvider: ng.ui.IStateProvider
        , $urlRouterProvider: ng.ui.IUrlRouterProvider
    ) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                  url: '/login'
                , templateUrl: 'views/login.html'
                , controller: 'LoginCtrl'
            });
    };

    let coreMods = [
          'ui.router'
        , 'ngResource'
        , 'ngStorage'
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
