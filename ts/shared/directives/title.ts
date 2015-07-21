/// <reference path="../../_all.ts" />

/** Zamiana tytułu strony po wczytaniu state */
module Shared.Directives {
    export class Title implements ng.IDirective {
        public restrict: string = 'A';

        constructor(
            private $rootScope: ng.IRootScopeService) {
        }

        public link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery) => {
            this.$rootScope.$on('$stateChangeSuccess', (event, toState) => {
                element
                    .toggleClass('hidden', !toState.title)
                    .text(toState.title);
            });
        };

        static factory(): ng.IDirectiveFactory {
            return $rootScope => new Title($rootScope);
        }
    }
    mod.directive('appTitle', Directives.Title.factory());
}