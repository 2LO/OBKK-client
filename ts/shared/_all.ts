/// <reference path="../_all.ts"/>
/// <reference path="interfaces/custom.ts"/>

module Shared {
    'use strict';

    /** Wiadomości na broadcast */
    export enum Message {
          USER_LOGIN
        , USER_LOGOUT
        , MODS_LOADED
    }

    export let mod = angular.module('shared', []);
    mod
        .config($httpProvider => {
            $httpProvider.interceptors.push('authInterceptor');
        })
        .run(($rootScope) => {
            $rootScope.$onMany = function(events, fn) {
                for (var i = 0; i < events.length; ++i)
                    this.$on(Message[events[i]], fn);
            };
        });

    _.mixin({
        chunk: function(array: any[], size: number) {
            return _(array)
                .chain()
                .groupBy((e, index) => {
                    return Math.floor(index / size);
                })
                .toArray()
                .value();
        }
    });
}