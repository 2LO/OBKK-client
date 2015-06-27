/// <reference path="../api/api.ts" />

/**
 * Autoryzacja użytkownika odbywa się
 * przez wysłanie JSONa z postacią interfejsu
 * User
 */
module Shared.Services {
    /**
     * Serwis odpowiedzialny za logowanie
     * oraz rejestracje użytkownika
     */
    export class Auth {
        constructor(
              private $rootScope: ng.IRootScopeService
            , private $localStorage
            , private api: IApi
        ) {
            this.reloadUser();
        };

        /** Użytkownik null jeśli nie zalogowany */
        private user: ILoggedUser = null;
        public get logged(): ILoggedUser {
            return this.user;
        };

        /**
         * Parsowanie części danych z tokena JWT
         * @param  {string} data Token JWT
         * @return {any}         Część danych
         */
        static getJwtData(data: string): ILoggedUser {
            let decoded = JSON.parse(
                decodeURIComponent(
                    atob(/\.(.*)\./.exec(data)[1])
                ));

            /** Weryfikacja ważności tokenu */
            if(new Date().getTime() / 1000 >= decoded.exp) {
                console.log('Token expired!');
                return null;
            } else
                return decoded;
        };


        /** Ponowne ładowanie użytkownika z tokenu */
        private reloadUser() {
            if(this.$localStorage.token) {
                this.user = Auth.getJwtData(this.$localStorage.token);
            }
            return this.user;
        };

        /**
         * Logowanie się użytkownika, jest to
         * wrapper UserResource, zapisywanie użytkownika
         * do LocalStorage i następne odtwarzanie
         * @param  {ILoginForm} form Formularz logowania
         * @return {ILoggedUser}     Zalogowany user, jeśli null to nie zalogowano
         */
        public login(form: ILoginForm): ILoggedUser {
            if(this.user)
                throw new Error('User is already logged in');
            
            this.api.User.login(form).$promise.then(data => {
                /** Token ładowany jest do localstorage */
                this.$localStorage.token = data.token;
                this.reloadUser();
            });
            return this.user;
        };

        /**
         * Wylogowywanie użytkownika z systemu, broadcast
         * nie dopuszczenie do przeładowania strony
         */
        public logout() {
            this.$localStorage.$reset();
            this.user = null;
        };
    };
};