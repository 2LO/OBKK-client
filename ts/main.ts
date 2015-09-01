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
                , templateUrl: 'views/registration/complete.html'
                , title: 'Dopełnienie rejestracji:'
            })
            .state('register.request', {
                  url: '/request'
                , templateUrl: 'views/registration/registration.html'
                , title: 'Rejestracja użytkownika:'
            })
            .state('news', {
                  url: '/news'
                , templateUrl: 'views/news.html'
                , controller: 'NewsCtrl'
            })
            .state('info', {
                  url: '/info'
                , templateUrl: 'views/info.html'
                , title: 'Informacje:'
            })
            .state('gallery', {
                  url: '/gallery?{path:any}&{file:any}'
                , templateUrl: 'views/gallery.html'
                , controller: 'GalleryCtrl'
                , reloadOnSearch: false
            })
            .state('calendar', {
                  url: '/calendar'
                , templateUrl: 'views/calendar.html'
                , controller: 'CalendarCtrl'
                , title: 'Kalendarz konferencji:'
                , data: {
                    flags: [ 'logged' ]
                }
            })
            .state('account', {
                  url: '/account'
                , templateUrl: 'views/account.html'
                , controller: 'AccountCtrl'
                , data: {
                    flags: [ 'logged' ]
                }
            })
            .state('inbox', {
                  url: '/inbox'
                , templateUrl: 'views/inbox/inbox.html'
                , controller: 'InboxCtrl'
                , title: 'Skrzynka pocztowa:'
                , data: {
                    flags: [ 'logged' ]
                }
            })
            .state('inbox.folder', {
                  url: '/folder/:folder'
                , templateUrl: 'views/inbox/folder.html'
                , controller: 'InboxCtrl.FolderCtrl'
            })
            .state('inbox.compose', {
                  url: '/compose'
                , templateUrl: 'views/inbox/compose.html'
                , controller: 'InboxCtrl.ComposeCtrl'
                , params: {
                    reply: null
                }
            })
            .state('inbox.folder.message', {
                  url: '/message/:message'
                , templateUrl: 'views/inbox/view.html'
                , controller: 'InboxCtrl.ViewCtrl'
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
    /** Prototypy */
    (<any> Array.prototype).last = function() {
        return this[this.length - 1];
    };

    /** Startowanie aplkacji */
    angular
        .element(document)
        .ready(angular.bootstrap.bind(null, document, [ 'app' ]));
})();
