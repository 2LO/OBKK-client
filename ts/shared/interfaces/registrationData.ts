/// <reference path="./loginData.ts" />

/**
 * Dane potrzebne do poprawnej
 * rejestracji użytkownika
 */

module Shared {
    /** Użytkownik w formie rejestracyjnej */
    export interface IRegistrationUser extends ILoggedUser {
        password: string;
        orders: string[];
        prelegant: boolean;
    };

    /**
     * Formularz rejestrujący użytkownika
     * oraz jego firmę, firma nie musi być
     * rejestrująca
     */
    export interface IRegistrationForm {
        user: IRegistrationUser;
        company?: {
              name: string
            , nip: string
            , info: {
                street: string
                , code: string
                , city: string
                , website: string
            }
        };
    };  
};