/// <reference path="../../_all.ts" />

/** Zamiana tytułu strony po wczytaniu state */
module Shared.Directives {
    export class Title implements ng.IDirective {
        public restrict: string = 'A';

        constructor(
              private $rootScope: ng.IRootScopeService
            , private $state: ng.ui.IStateService) {
        }

        public link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery) => {
            this.$rootScope.$on('$stateChangeSuccess', (event, toState) => {
                /** Jeśli to stan dziecka to nie chowa tytułowego paska */
                let parentName = toState.name.match(/^(\w*)\./);
                if(parentName && !toState.title)
                    toState.title = (<{ title: string}> this.$state.get(parentName[1])).title;

                /** Chowanie jeśli nie ma nazwy */
                element
                    .toggleClass('hidden', !toState.title || !toState.title.length)
                    .text(toState.title);
            });
        };

        static factory(): ng.IDirectiveFactory {
            return ($rootScope, $state) => new Title($rootScope, $state);
        }
    }
    mod.directive('appTitle', Directives.Title.factory());
}