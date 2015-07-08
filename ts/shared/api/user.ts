module Shared {
    export module Form {
        /** Formularz logowania */
        export interface ILogin {
              login: string
            , password: string
        };


        /**
         * Formularz rejestrujący użytkownika
         * oraz jego firmę, firma nie musi być
         * rejestrująca
         */
        export interface IRegistration {
            user: IRegistrationUser;
            company?: {
                  name: string
                , users: ICompanyUser[]
                , nip: string
                , copyOrders: boolean /** kopiuje zamówienia admina do uczestników */
                , info: {
                      street: string
                    , code: string
                    , city: string
                    , website: string
                }
            };
        };

        /**
         * Formularz, który dokańcza rejestracje
         * użytkownika
         */
        export interface IComplete {
            id: string;
            user: {
                info: {
                    phone: string;
                };
                password: string;
                orders: string[];
            };
        };
    };

    /**
     * Token zwracany przez serwer po pomyślnym
     * zalogowaniu, wrzucany do pamięci podręcznej
     */
    export interface IUserToken extends ng.resource.IResource<IUserToken> {
        token: string;
    };

    /** Interfejs, z którego dziedziczą ILoggedUser i IRegistrationUser */
    interface IUserInfo {
        email: string;
        info: {
              name: string
            , surname: string
            , phone: string
        };
    };

    /**
     * Użytkownik wygenerowany po przetworzeniu
     * tokenu, który otrzymywany jest po zalogowaniu
     */
    export interface ILoggedUser extends IUserInfo, ng.resource.IResource<ILoggedUser> {
        /** grupy to string może kiedyś stanie się strukturą */
        groups: string[];
        
        /** Ważność tokenu */
        iat: number;
        exp: number;
    };

    /** Użytkownik w formie rejestracyjnej */
    export interface IRegistrationUser extends IUserInfo, ILoggedUser {
        password: string;
        orders: string[];
        prelegant: boolean;
    };

    /** Użytkownik rejestrowany przez firmę */
    export interface ICompanyUser {
        name: string;
        surname: string;
        email: string;
    };

    /**
     * Interfejs resource dla rejestracji
     * i autoryzacji użytkownika
     */
    export interface IUserResource extends ng.resource.IResourceClass<IUserToken> {
        register(data: Form.IRegistration): IUserToken;
        complete(data: Form.IComplete);
        login(data: Form.ILogin): IUserToken;
    };

    export module API {
        /** Akcja logowania */
        let loginAction: ng.resource.IActionDescriptor = {
              method: 'POST'
            , params: { action: 'login' }
        };

        /** Akcja rejestrowania */
        let registerAction: ng.resource.IActionDescriptor = {
              method: 'PUT'
            , params: { action: 'register' }
        };

        /** Akcja rejestrowania */
        let completeAction: ng.resource.IActionDescriptor = {
              method: 'PUT'
            , url: '/user/:action/:id'
            , params: { 
                  action: 'complete' 
                , id: '@id'
            }
        };

        /**
         * Zasób użytkownika, funkcja a nie klasa
         * bo jest to factory
         */
        export function UserResource($resource: ng.resource.IResourceService) {
            return <IUserResource> $resource('/user/:action', {}, {
                  login: loginAction
                , register: registerAction
                , complete: completeAction
            });
        };
    };
};