/// <reference path="../../_all.ts" />

/**
 * Dyrektywa odpowiedzialna za weryfikacje uprawnień
 * użytkownika w kontrolkach, chowane są o ile nie są
 * to jego uprawnienia
 */
module Shared.Directives {
    type PermissionData = Services.Security.IElement;
    interface IPermissionScope extends ng.IScope {
        data: PermissionData;
        flag: string;
        mod: string;
    };

    /** Dyrektywa elementu np. <a appPermission=...> */
    export class Permission implements ng.IDirective {
        public restrict: string = 'A';
        public scope = {
              data: '=?appPermission'
            , flag: '@appFlag'
            , mod:  '@appMod'
        };

        constructor(
              private $state: ng.ui.IStateProvider
            , private $rootScope: ng.IRootScopeService
            , private permission: Services.Permission) {
        };

        public link: ng.IDirectiveLinkFn = (scope: IPermissionScope, element: ng.IAugmentedJQuery, attrs: any) => {
            let permission = scope.data || <PermissionData> { flags: [], mods: [] };
            /** 
             * Jeśli data jest puste i ui-sref istnieje to bierze
             * reguły zabezpieczeń ze stanu, na który ui-sref wskazuje
             */
            if(!scope.data && 'uiSref' in attrs) {
                permission = this.$state.$get(
                    /(\w*)(\.|$)/.exec(attrs['uiSref'])[1]).data;
            };

            /** 
             * tzn. app-permission, app-flag='logged' 
             * zamiast app-permission={ flags: [ 'logged' ]}
             */
            if(scope.mod)
                permission.mods.push(scope.mod);
            if(scope.flag)
                permission.flags.push(scope.flag);

            /** Sprawdzanie warunku zalogowania */
            let checkPermission = () => {
                element.toggleClass('ng-hide', !this.permission.check(permission));
            };

            /** Czekanie na zalogowanie */
            this.$rootScope.$on(
                  Message[Message.USER_LOGGED]
                , checkPermission.bind(this));
            checkPermission();
        };

        static factory(): ng.IDirectiveFactory {
            return ($state, $rootScope, permission) => new Permission($state, $rootScope, permission);
        };
    };
};