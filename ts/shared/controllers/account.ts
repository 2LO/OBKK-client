/// <reference path="../_all.ts"/>

module Shared.Controllers {
    /**
     * Parsowanie daty w postaci cyfry na string'a
     * @param   {number} date Data w postaci cyfry
     * @returns {string} Data
     */
    function parseDate(date: number): string {
        return new Date(date).toUTCString();
    }

    /**
     * Kontroller odpowiedzialny za zlistowanie
     * informacji o uzytkowniku na podstawie tokenu
     * i dodatkowych informacji z serwera
     */
    interface IAccountScope extends ICtrlScope<Account> {
        user: ILoggedUser;
        key: {
            iat: string;
            ext: string;
        };
    }
    export class Account extends Controller {
        constructor(
              private $scope: IAccountScope
            , private auth: Services.Auth
        ) {
            super($scope, {
                  user: auth.logged
                , key: {
                      iat: parseDate(auth.logged.iat)
                    , exp: parseDate(auth.logged.exp)
                }
            });
            console.log(auth.logged);
        }
    }
    mod.controller('AccountCtrl', Account);
}
