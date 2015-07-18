/// <reference path="./services/auth.ts" />
/// <reference path="./services/permission.ts" />
/// <reference path="./services/loader.ts" />

/// <reference path="./controllers/navbar.ts" />
/// <reference path="./controllers/login.ts" />
/// <reference path="./controllers/registration.ts" />
/// <reference path="./controllers/calendar.ts" />
/// <reference path="./controllers/err.ts" />
/// <reference path="./controllers/gallery.ts" />
/// <reference path="./controllers/news.ts" />

/// <reference path="./directives/placeholder.ts" />
/// <reference path="./directives/checkboxList.ts" />
/// <reference path="./directives/permission.ts" />
/// <reference path="./directives/alias.ts" />
/// <reference path="./directives/title.ts" />
/// <reference path="./directives/toggleClass.ts" />

module Shared {
    'use strict';

    /** Wiadomości na broadcast */
    export enum Message {
          USER_LOGIN
        , USER_LOGOUT
        , MODS_LOADED
    }

    let mod = angular
        .module('shared', [])
        .config(($httpProvider) => {
            $httpProvider.interceptors.push('authInterceptor');
        })
        .factory('authInterceptor', Services.AuthInterceptor.factory())

        .service('permission', Services.Permission)
        .run(Services.statePermission)
        .run(($rootScope) => {
            $rootScope.$onMany = function(events, fn) {
                for (var i = 0; i < events.length; ++i)
                    this.$on(Message[events[i]], fn);
            };
        })

        .service('loader', Services.Loader)
        .service('auth', Services.Auth)
        .factory('api', API.Api)

        .controller('NavbarCtrl', Controllers.Navbar)
        .controller('LoginCtrl', Controllers.Login)
        .controller('RegistrationCtrl', Controllers.Registration)
        .controller('CalendarCtrl', Controllers.Calendar)
        .controller('ErrorCtrl', Controllers.Err)
        .controller('GalleryCtrl', Controllers.Gallery)
        .controller('NewsCtrl', Controllers.News)

        .directive('ngPlaceholder', Directives.Placeholder.factory())
        .directive('ngCheckboxList', Directives.CheckboxList.factory())

        .directive('appPermission', Directives.Permission.factory())
        .directive('appTitle', Directives.Title.factory())
        .directive('ngToggleClass', Directives.ToggleClass.factory());

    /** Dodawanie alliasów */
    _(Directives.aliases).each((val: any, attribute: string) => {
        _(val).each((val: string, alliasName: string) => {
            mod.directive(alliasName, Directives.createAlias(attribute, val));
        });
    }); 
}