/// <reference path="./_all.ts" />
/// <reference path="./shared/_all.ts" />

'use strict';

module Application {
    function config(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            /** Ekran błędu */
            .state('error', {
                  url: '/error/:code'
                , templateUrl: 'views/err.html'
                , controller: 'ErrorCtrl'
                , title: 'Błąd:'
            })
            .state('login', {
                  url: '/login'
                , templateUrl: 'views/login.html'
                , controller: 'LoginCtrl'
                , title: 'Logowanie użytkownika:'
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
                , title: 'Dopełnienie rejestracji:'
            })
            .state('register.request', {
                  url: '/request'
                , templateUrl: 'views/registration.html'
                , title: 'Rejestracja użytkownika:'
            })
            .state('news', {
                  url: '/news'
                , templateUrl: 'views/news.html'
                , controller: 'NewsCtrl'
                , title: 'Aktualności systemu:'
            })
            .state('gallery', {
                  url: '/gallery'
                , templateUrl: 'views/gallery.html'
                , controller: 'GalleryCtrl'
            })
            .state('calendar', {
                  url: '/calendar'
                , templateUrl: 'views/calendar.html'
                , controller: 'CalendarCtrl'
                , title: 'Wykłady na konferencji:'
                , data: {
                    flags: [ 'logged' ]
                }
            })
            .state('account', {
                  url: '/account'
                , templateUrl: 'views/account.html'
                , title: 'Twoje konto:'
                , data: {
                    flags: [ 'logged' ]
                }
            });
    }

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
}
(() => {
    angular
        .element(document)
        .ready(angular.bootstrap.bind(null, document, [ 'app' ]));
})();
