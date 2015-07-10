///<reference path="../_all.ts"/>

/**
 * Kontroller ekranu logowania,
 * rozsuwanie panelu rejestracyjnyego
 */
module Shared.Controllers {
    interface ILoginScope extends ICtrlScope<Login> {
        form: Form.ILogin;
        error: string;
    }

    export class Login {
        constructor(
              private $scope: ILoginScope
            , private $state: ng.ui.IStateService
            , private $rootScope: ng.IRootScopeService
            , private auth: Services.Auth
        ) {
            $scope.fn = this;
        }

        /** Funkcja wywoływana po poprawnym zalogowaniu */
        private onLogged() {
            this.$rootScope.$broadcast(
                  Message[Message.USER_LOGIN]
                , this.auth.logged);
            this.$state.go('calendar');
        }

        /**
         * Funkcja wywoływana przy wciśnięciu przycisku
         * logowania w ng-submit w formularzu
         */
        public login() {
            this.auth
                .login(this.$scope.form)
                .then(this.onLogged.bind(this))
                .catch(error => {
                    this.$scope.error = error.data;
                });
        }
    }
}
