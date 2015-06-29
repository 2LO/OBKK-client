/// <reference path="../../_all.ts" />

/**
 * Dyrektywa odpowiedzialna za weryfikacje uprawnień
 * użytkownika w kontrolkach, chowane są o ile nie są
 * to jego uprawnienia
 */
module Shared.Directives {
    interface IPermissionScope extends ng.IScope {
        data: Services.Security.IElement;
    };

    /** Dyrektywa elementu np. <a appPermission=...> */
    export class Permission implements ng.IDirective {
        public restrict: string = 'A';
        public scope = {
            data: '=?appPermission' 
        };

        constructor(
              private $state: ng.ui.IStateProvider
            , private $rootScope: ng.IRootScopeService
            , private permission: Services.Permission) {
        };

        public link: ng.IDirectiveLinkFn = (scope: IPermissionScope, element: ng.IAugmentedJQuery, attrs: any) => {
            /** 
             * Jeśli brak sprecyzowanego warunku dostępu
             * to bierze z ui-srefa
             */
            if(_.isUndefined(scope.data)) {
                if(!('uiSref' in attrs))
                    throw new Error('Unknown permission!');
                scope.data = this.$state.$get(
                    /(\w*)(\.|$)/.exec(attrs['uiSref'])[1]).data;
            }

            /** Sprawdzanie */
            let checkPermission = () => {
                element.toggleClass('ng-hide', !this.permission.check(scope.data));
            };

            /** Czekanie na zalogowanie */
            this.$rootScope.$on(Message[Message.USER_LOGGED], () => {
                checkPermission();
            });
            checkPermission();
        };

        static factory(): ng.IDirectiveFactory {
            return ($state, $rootScope, permission) => new Permission($state, $rootScope, permission);
        };
    };
};