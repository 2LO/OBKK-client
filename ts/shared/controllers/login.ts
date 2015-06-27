/**
 * Kontroller ekranu logowania,
 * rozsuwanie panelu rejestracyjnyego
 */
module Shared.Controllers {
    export class Login {
        constructor(
            private $scope: any
        ) {
            $scope.caller = this;
        };
    };
};
