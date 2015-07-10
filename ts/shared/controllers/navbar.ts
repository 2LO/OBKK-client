/// <reference path="../services/auth.ts" />
/// <reference path="../interfaces/custom.ts" />

/**
 * Kontroller paska menu strony, 
 * pokazuje powiadomienia itp.
 */
module Shared.Controllers {
    interface INavbarScope extends ICtrlScope<Navbar>  {
        displayName: string;
        lastLogged: string;
    }

    /**
     * Navbar zwykle nie jest przeładowywany
     * po zalogowaniu aktualizowane są wartości
     */
    export class Navbar {
        constructor(
              private $scope: INavbarScope
            , private auth: Services.Auth
            , private $rootScope: ng.IRootScopeService
        ) {
            $scope.fn = this;
            $rootScope.$on(Message[Message.USER_LOGIN], this.reload.bind(this));
            this.reload();
        }

        /**
         * Ponowne wczytywanie elementu
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
}