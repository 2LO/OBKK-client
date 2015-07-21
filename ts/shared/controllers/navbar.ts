/// <reference path="../_all.ts"/>
/// <reference path="../services/auth.ts" />
/// <reference path="../services/loader.ts" />
/// <reference path="../interfaces/custom.ts" />

/**
 * Kontroller paska menu strony, 
 * pokazuje powiadomienia itp.
 */
module Shared.Controllers {
    interface INavbarScope extends ICtrlScope<Navbar>  {
        displayName: string;
        lastLogged: string;
        mods: IModuleInfo[];
    }

    /**
     * Navbar zwykle nie jest przeładowywany
     * po zalogowaniu aktualizowane są wartości
     */
    export class Navbar extends Controller {
        constructor(
              private $scope: INavbarScope
            , private $rootScope: ng.IRootScopeService
            , private auth: Services.Auth
            , private loader: Services.Loader
        ) {
            super($scope);

            $rootScope.$on(Message[Message.MODS_LOADED], this.loadModules.bind(this));
            $rootScope.$on(Message[Message.USER_LOGIN], this.reload.bind(this));
            this.reload();
        }

        /** Wczytywanie menu modułów */
        private loadModules() {
            this.$scope.mods = this.loader.info;
        }

        /**
         * Ponowne wczytywanie elementu po
         * zalogowaniu użytkownika bo kontroler
         * się nie wczytuje od nowa
         */
        private reload() {
            if(this.auth.logged) {
                this.$scope.lastLogged = new Date(this.auth.logged.exp).toLocaleString();
                this.$scope.displayName = this.auth.logged.email;
            }
        }

        /**
         * Wylogowywanie się, przycisk wywoływany
         * przez akcje naciśnięcia linka w menu strony
         */
        public logout() {
            this.auth.logout();
            this.$rootScope.$broadcast(Message[Message.USER_LOGOUT]);
        }
    }
    mod.controller('NavbarCtrl', Navbar);
}