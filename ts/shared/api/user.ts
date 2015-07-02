module Shared {
    /** Formularz logowania */
    export interface ILoginForm {
          login: string
        , password: string
    };
    interface IUserInfo {
        email: string;
        info: {
              name: string
            , surname: string
            , phone: string
        };
    };

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
    export interface ILoggedUser extends IUserInfo, ng.resource.IResource<ILoggedUser> {
        groups: any[];
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
     * Formularz rejestrujący użytkownika
     * oraz jego firmę, firma nie musi być
     * rejestrująca
     */
    export interface IRegistrationForm {
        user: IRegistrationUser;
        company?: {
              name: string
            , users: ICompanyUser[]
            , nip: string
            , info: {
                  street: string
                , code: string
                , city: string
                , website: string
            }
        };
    }; 

    /**
     * Interfejs resource dla rejestracji
     * i autoryzacji użytkownika
     */
    export interface IUserResource extends ng.resource.IResourceClass<IUserToken> {
        register(regForm: IRegistrationForm): IUserToken;
        login(loginForm: ILoginForm): IUserToken;
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

        /**
         * Zasób użytkownika, funkcja a nie klasa
         * bo jest to factory
         */
        export function UserResource($resource: ng.resource.IResourceService) {
            return <IUserResource> $resource('/user/:action', {}, {
                  login: loginAction
                , register: registerAction
            });
        };
    };
};