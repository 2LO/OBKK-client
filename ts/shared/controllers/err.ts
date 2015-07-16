///<reference path="../_all.ts"/>

/** Kontroller obsługujący ekran błędów */
module Shared.Controllers {
    interface ErrScope extends ICtrlScope<ErrScope> {
        code: number;
        info: string;
    }

    export class Err extends Controller {
        constructor(
              private $scope: ErrScope
            , private $stateParams: { code: number; }
        ) {
            super($scope);
            $scope.code = $stateParams.code;
            $scope.info = {
                  401: 'brak uprawnień do przeglądania strony!'
                , 404: 'strona nie istnieje!'
            }[$scope.code];
        }
    }
}