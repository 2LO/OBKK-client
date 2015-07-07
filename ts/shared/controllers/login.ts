/**
 * Kontroller ekranu logowania,
 * rozsuwanie panelu rejestracyjnyego
 */
module Shared.Controllers {
    interface ILoginScope extends ICtrlScope<Login> {
        form: Form.ILogin;
    };

    export class Login {
        constructor(
              private $scope: ILoginScope
            , private $rootScope: ng.IRootScopeService
            , private auth: Services.Auth
        ) {
            $scope.fn = this;
        };

        /** Logowanie */
        private onLogged() {
            this.$rootScope.$broadcast(
                  Message[Message.USER_LOGIN]
                , this.auth.logged);
        };
        public login() {
            this.auth
                .login(this.$scope.form)
                .finally(this.onLogged.bind(this));
        };
    };
};
