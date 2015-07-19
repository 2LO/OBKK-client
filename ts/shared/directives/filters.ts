///<reference path="../_all.ts"/>

module Shared.Filters {
    /** Filtr wykorzystywany do walidacji html'a w ng-bind-html */
    export function trustHtml($sce: ng.ISCEService) {
        return (text) => {
            return $sce.trustAsHtml(text);
        };
    }
}

