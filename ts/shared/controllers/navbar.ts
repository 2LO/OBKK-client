/// <reference path="../services/auth.ts" />

/**
 * Kontroller paska menu strony, 
 * pokazuje powiadomienia itp.
 */

module Shared {
    interface INavbarScope extends ng.IScope  {
        displayName: string;
        lastLogged: string;
    };

    export class NavbarCtrl {
        constructor(
              private $scope: INavbarScope
            , private auth: Shared.Auth
        ) {
            $scope.lastLogged = new Date(auth.logged.exp).toLocaleString();
            $scope.displayName = auth.logged.email;
            // auth.login({
            //       login: 'cziken@vp.pl'
            //     , password: ''
            // });
        };
    };
};