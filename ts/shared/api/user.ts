module Shared {
    /**
     * Informacje na temat modułu
     * porzebne do paska navbar menu
     */
    export interface IModuleInfo {
        name: string; /** nazwa modułu */
        path: string; /** ścieżka do pliku */
        menu: {
            title: string; /** nazwa w menu */
            ref:  string; /** ścieżka dla ui-router */
            info: string; /** dumek po najechaniu */
            icon: string; /** ikona */
            links: { title: string; ref: string; }[];
        };
    }

    /**
     * Interfejs resource dla rejestracji
     * i autoryzacji użytkownika
     */
    export interface IUserResource extends ng.resource.IResourceClass<any> {
        /** API dostępne po zalogowaniu */
        modules(): IModuleInfo[]
    }

    export module API {
        /** Akcja listowania modułów */
        let modulesAction: ng.resource.IActionDescriptor = {
              method: 'GET'
            , params: { action: 'mods' }
            , isArray: true
        };

        /**
         * Zasób użytkownika, funkcja a nie klasa
         * bo jest to factory
         */
        export function UserResource($resource: ng.resource.IResourceService) {
            return <IUserResource> $resource('/user/:action', {}, {
                modules: modulesAction
            });
        }
    }
}