/**
 * Kontroller ekranu logowania,
 * rozsuwanie panelu rejestracyjnyego
 */
module Shared.Controllers {
    interface ILoginScope extends ICtrlScope<Login> {
        form: ILoginForm;
    };

    export class Login {
        constructor(
              private $scope: ILoginScope
            , private auth: Services.Auth
        ) {
            $scope.fn = this;
        };

        public login() {
            this.auth
                .login(this.$scope.form)
                .finally(():any => {
                    console.log();
                });
        };
    };
};
