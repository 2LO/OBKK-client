/// <reference path="./auth.ts" />

module Shared.Services {
    export module Security {
        /** <a ng-permission /> */
        export interface IElement {
            flags: string[];
            mods?: string[];
        };

        /** W routingu przy stanach */
        export interface IState {
            authorize?: (params: any) => boolean;
            anonymous: boolean;
        };
    };

    /**
     * Serwis odpowiedzialny za prostą
     * weryfikacje uprawnień użytkownika
     */
    export class Permission {
        constructor(
            private auth: Auth // flags są static
        ) {
        };

        /** Flagi sprawdzane przy autoryzowaniu */
        public static flags = {
              'logged': function() { return this.auth.logged; }
            , 'anon':   function() { return !Permission.flags.logged.call(this); }
        };

        /**
         * Sprawdzanie przyzwoleń
         * @param  {Security.IElement} data Uprawnienia
         * @return {boolean}           Jeśli użytkownik spełnia uprawnienia zawraca true
         */
        public check(data: Security.IElement|string): boolean {
            if(_.isUndefined(data))
                return true;

            else if(typeof data === 'string')
                data = <Security.IElement> { flags: [ data ] };

            if(typeof data !== 'string') {
                /** Wymaganie zalogowania */
                let hasFlags = _(data.flags).every((flag: string): any => {
                    if(Permission.flags[flag].call(this))
                        return true;
                });
                if(!hasFlags)
                    return false;

                /** Wymagania modułów */
                if( !_.isUndefined(data.mods)
                        && _.difference(data.mods, _.pluck(this.auth.logged.groups, 'name')).length)
                    return false;
            }
            return true;
        };
    };

    /**
     * Funkcja wywoływana podczas zmiany stanu
     * @param {Permission}           permission Serwis zabezpieczeń
     * @param {[type]}               ERROR_CODE [description]
     */
    export function statePermission(
              $rootScope: ng.IRootScopeService
            , $state: ng.ui.IStateService
            , permission: Permission) {
        $rootScope.$on( '$stateChangeStart'
                      , (event, toState, toParams, fromState, fromParams) => {
            let data = toState.data;

            /** 
             * Jeśli posiada własną funckję autoryzującą 
             * to rozszerzane są uprawnienia
             */
            if(data && _.isFunction(data.authorize))
                _.extend(data, data.authorize(toParams));

            if(!permission.check(data)) {
                $state.go('error', { name: 401 });
                event.preventDefault();
            }
        });
    };
};
