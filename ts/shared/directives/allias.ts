/// <reference path="../_all.ts" />

/** Alliasy na Permission */
module Shared.Directives {
    export function createAllias(directive: string, param: string) {
        return () => ({
              template: '<div ' + directive + '="' + param + '" ng-transclude></div>'
            , transclude: true
            , replace: true
        });
    };

    /** Alliasy na flagi w permission */
    export let alliases = {
        'app-permission': {
              'loggedOnly': '{flags: [\'logged\']}'
            , 'anonOnly':   '{flags: [\'anon\']}'
        }
    };
};