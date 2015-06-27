/// <reference path="./services/auth.ts" />
/// <reference path="./controllers/navbar.ts" />
/// <reference path="./controllers/login.ts" />
/// <reference path="./controllers/registration.ts" />
/// <reference path="./directives/placeholder.ts" />
/// <reference path="./directives/checkboxList.ts" />

module Shared {
    'use strict';

    angular
        .module('shared', [])

        .service('auth', Services.Auth)
        .factory('api', API.Api)

        .controller('NavbarCtrl', Controllers.Navbar)
        .controller('LoginCtrl', Controllers.Login)
        .controller('RegistrationCtrl', Controllers.Registration)

        .directive('ngPlaceholder', Directives.Placeholder.factory())
        .directive('ngCheckboxList', Directives.CheckboxList.factory());
};