/// <reference path="../../_all.ts" />

/**
 * Dane potrzebne do poprawnego
 * logowania użytkownika
 */

module Shared {
    /**
     * Token zwracany przez serwer po pomyślnym
     * zalogowaniu, wrzucany do pamięci podręcznej
     */
    export interface IUserToken extends ng.resource.IResource<IUserToken> {
        token: string;
    };

    /**
     * Użytkownik wygenerowany po przetworzeniu
     * tokenu, który otrzymywany jest po zalogowaniu
     */
    export interface ILoggedUser extends ng.resource.IResource<ILoggedUser> {
        email: string;
        info: {
              name: string
            , surname: string
            , phone: string
        };
        groups?: any[];
        /** Ważność tokenu */
        iat: number;
        exp: number;
    };

    /** Formularz logowania */
    export interface ILoginForm {
          login: string
        , password: string
    };
};