/// <reference path="../api/api.ts" />
/// <reference path="./auth.ts" />

/**
 * Wczytywanie modułów następuje dopiero
 * gdy użytkownik wejdzie na link, pobierane
 * jest IModuleInfo z serwera po nazwach
 * w tokenie
 */
module Shared.Services {
    export class Loader {
        constructor(
              private $rootScope: ng.IRootScopeService
            , private api: IApi
        ) {
            api.User.modules().$promise.then(data => {
                this.userData = data;
                /** Wczytywanie modułów.. */

                /**
                 * Po pomyślnym wczytaniu wszystkiego dopiero
                 * renderowane są linki w menu
                 */
                $rootScope.$broadcast(Message[Message.MODS_LOADED]);
            });
        }

        /** Dane na temat modułów, menu itp. */
        private userData: IModuleInfo[] = null;
        public get info(): IModuleInfo[] {
            return this.userData;
        }
    }
}
