/// <reference path="./services/auth.ts" />
/// <reference path="./controllers/navbar.ts" />

module Shared {
    'use strict';

    angular.module('shared', [])
        .factory('userResource', UserResource)
        .service('auth', Auth)
        .controller('NavbarCtrl', NavbarCtrl);  
};