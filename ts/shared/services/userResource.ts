/// <reference path="../interfaces/registrationData.ts" />

module Shared {
    /**
     * Interfejs resource dla rejestracji
     * i autoryzacji użytkownika
     */
    export interface IUserResource extends ng.resource.IResourceClass<IUserToken> {
        register(regForm: IRegistrationForm): void;
        login(loginForm: ILoginForm): IUserToken;
    };

    /**
     * Zasób użytkownika, funkcja a nie klasa
     * bo jest to factory
     */
    export function UserResource($resource: ng.resource.IResourceService) {
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

        return <IUserResource> $resource('/user/:action', {}, {
              login: loginAction
            , register: registerAction
        });
    };
};