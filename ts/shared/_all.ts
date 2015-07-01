/// <reference path="./services/auth.ts" />
/// <reference path="./services/permission.ts" />
/// <reference path="./controllers/navbar.ts" />
/// <reference path="./controllers/login.ts" />
/// <reference path="./controllers/registration.ts" />
/// <reference path="./directives/placeholder.ts" />
/// <reference path="./directives/checkboxList.ts" />
/// <reference path="./directives/permission.ts" />
/// <reference path="./directives/allias.ts" />

module Shared {
    'use strict';

    /** Wiadomości na broadcast */
    export enum Message {
          USER_LOGIN
        , USER_LOGOUT
    };

    let mod = angular
        .module('shared', [])

        .service('permission', Services.Permission)
        .run(Services.statePermission)
        .run(($rootScope) => {
            $rootScope.$onMany = function(events, fn) {
                for (var i = 0; i < events.length; ++i)
                    this.$on(Message[events[i]], fn);
            };
        })

        .service('auth', Services.Auth)
        .factory('api', API.Api)

        .controller('NavbarCtrl', Controllers.Navbar)
        .controller('LoginCtrl', Controllers.Login)
        .controller('RegistrationCtrl', Controllers.Registration)

        .directive('ngPlaceholder', Directives.Placeholder.factory())
        .directive('ngCheckboxList', Directives.CheckboxList.factory())

        .directive('appPermission', Directives.Permission.factory());

    /** Dodawanie alliasów */
    _(Directives.alliases).each((val: any, attribute: string) => {
        _(val).each((val: string, alliasName: string) => {
            mod.directive(alliasName, Directives.createAllias(attribute, val));
        });
    }); 
};