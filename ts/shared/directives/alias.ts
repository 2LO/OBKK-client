/// <reference path="../_all.ts" />

/** Alliasy na Permission */
module Shared.Directives {
    export function createAlias(directive: string, param: string) {
        return () => ({
              template: '<div ' + directive + '="' + param + '" ng-transclude></div>'
            , transclude: true
        });
    }

    /** Alliasy na flagi w permission */
    export let aliases = {
        'app-permission': {
              'loggedOnly': '{flags: [\'logged\']}'
            , 'anonOnly':   '{flags: [\'anon\']}'
        }
    };
    /** Dodawanie alliasów */
    _(Directives.aliases).each((val: any, attribute: string) => {
        _(val).each((val: string, alliasName: string) => {
            mod.directive(alliasName, Directives.createAlias(attribute, val));
        });
    });
}