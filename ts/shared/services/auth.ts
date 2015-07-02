/// <reference path="../api/api.ts" />

/**
 * Autoryzacja użytkownika odbywa się
 * przez wysłanie JSONa z postacią interfejsu
 * User
 */
module Shared.Services {
    /**
     * Wszystkie zasoby aplikacji
     * TODO: przeniesienie do innego
     * pliku
     */
    export interface IAppStorage {
        token: string;
        $reset();
    };

    /**
     * Serwis odpowiedzialny za logowanie
     * oraz rejestracje użytkownika
     */
    export class Auth {
        constructor(
              private $localStorage: IAppStorage
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
            if(!decoded || new Date().getTime() / 1000 >= decoded.exp) {
                console.log('Token expired!');
                return null;
            } else
                return decoded;
        };


        /** Ponowne ładowanie użytkownika z tokenu */
        private reloadUser(): ILoggedUser {
            return this.$localStorage.token 
                        ? this.user = Auth.getJwtData(this.$localStorage.token)
                        : this.user;
        };

        /**
         * Logowanie się użytkownika, jest to
         * wrapper UserResource, zapisywanie użytkownika
         * do LocalStorage i następne odtwarzanie
         * @param  {ILoginForm} form Formularz logowania
         */
        public login(form: ILoginForm): ng.IPromise<any> {
            if(this.user)
                throw new Error('User is already logged in');

            return (
                this.api.User
                        .login(form)
                        .$promise.then((data: ILoginResponse) => {
                    /** Token ładowany jest do localstorage */
                    this.$localStorage.token = data.token;
                    this.reloadUser();
                })
            );
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
