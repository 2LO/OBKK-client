/// <reference path="./auth.ts" />

module Shared.Services {
    export module Security {
        /** <a ng-permission /> */
        export interface IElement {
            flags: string[];
            mods?: string[];
        }

        /** W routingu przy stanach */
        export interface IState {
            authorize?: (params: any) => boolean;
            anonymous: boolean;
        }
    }

    /**
     * Serwis odpowiedzialny za prostą
     * weryfikacje uprawnień użytkownika
     */
    export class Permission {
        constructor(
            private auth: Auth // flags są static
        ) {
        }

        /** Flagi sprawdzane przy autoryzowaniu */
        public static flags = {
              'logged': function() { return this.auth.logged; }
            , 'anon':   function() { return !Permission.flags.logged.call(this); }
        };

        /**
         * Sprawdzanie przyzwoleń
         * @param  {Security.IElement|string} data Uprawnienia
         * @return {boolean}  Jeśli użytkownik spełnia uprawnienia zawraca true
         */
        public check(data: Security.IElement|string): boolean {
            if(!data)
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
                if(data.mods 
                        && this.auth.logged
                        && _.difference(data.mods, _.pluck(this.auth.logged.mods, 'name')).length)
                    return false;
            }
            return true;
        }
    }

    /**
     * Funkcja wywoływana podczas zmiany stanu
     * @param {ng.IRootScopeService} $rootScope
     * @param {ng.ui.IStateService}  $state
     * @param {Permission}           permission Serwis zabezpieczeń
     */
    export function statePermission(
              $rootScope: ng.IRootScopeService
            , $state: ng.ui.IStateService
            , permission: Permission) {
        $rootScope.$on( '$stateChangeStart'
                      , (event, toState, toParams) => {
            let data = toState.data;

            /** 
             * Jeśli posiada własną funckję autoryzującą 
             * to rozszerzane są uprawnienia
             */
            if(data && _.isFunction(data.authorize))
                _.extend(data, data.authorize(toParams));

            /**
             * Jeśli nie przejdzie testu to
             * stan przekieruje na strone błędu 401
             */
            if(!permission.check(data)) {
                $state.go('error', { name: 401 });
                event.preventDefault();
            }
        });
    }

    /**
     * Podczas request'u na serwer dodawany jest
     * do niego token użytkownika o ile jest zalogowany
     * i dodatkowe parametry
     */
    export class AuthInterceptor {
        constructor(
            private $injector
        ) {
        }

        /**
         * Metoda wywoływana przed zapytaniem do serwera,
         * dodawanie własnych nagłówków
         */
        public request: ng.IRequestShortcutConfig = (config: ng.IRequestConfig): ng.IRequestConfig => {
            /** 
             * Bugfix: Circular dependency problem.
             * http://stackoverflow.com/questions/14681654/i-need-two-instances-of-angularjs-http-service-or-what
             */
            this.$injector.invoke(($localStorage: IAppStorage) => {
                config.headers.Accept = 'application/json, text/javascript';
                
                let token = $localStorage.token;
                if(token) {
                    /** 
                     * Mierzenie rozmiaru tokenu w bajtach, 
                     * jeśli przekroczy 512B to ostrzega w aseracji
                     */
                    console.assert(
                           encodeURI(token).split(/%..|./).length-1 < 512
                        , 'Token is too big!');
                    (<any> config.headers).authorization = 'Bearer '.concat(token);
                }
            });
            return config;
        };

        static factory() {
            return ($injector) => new AuthInterceptor($injector);
        }
    }
    mod
        .factory('authInterceptor', AuthInterceptor.factory())
        .service('permission', Permission)
        .run(statePermission);
}
