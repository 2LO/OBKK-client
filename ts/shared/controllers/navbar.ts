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
    };

    export class Navbar {
        constructor(
              private $scope: INavbarScope
            , private auth: Services.Auth
        ) {
            if(!auth.logged) {
                auth.login({
                      login: 'cziken@vp.pl'
                    , password: ''
                });
            }
            $scope.lastLogged = new Date(auth.logged.exp).toLocaleString();
            $scope.displayName = auth.logged.email;
            $scope.fn = this;
        };

        /**
         * Wylogowywanie się, przycisk wywoływany
         * przez akcje naciśnięcia linka w menu strony
         */
        public logout() {
            this.auth.logout();
            /** TODO: przekierowanie na stronę główną */
        };
    };
};