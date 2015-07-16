/// <reference path="../../_all.ts" />

/** Ustawianie klasy na obiekt po wciśnięciu */
module Shared.Directives {
    interface IToggleScope extends ng.IScope {
        className: string;
    }

    export class ToggleClass implements ng.IDirective {
        public restrict: string = 'A';
        public scope = {
            className: '@ngToggleClass'
        };

        public link: ng.IDirectiveLinkFn = (scope: IToggleScope, element: ng.IAugmentedJQuery) => {
            // bug: element.bind('click', <any> element.toggleClass.bind(element, scope.className));
            element.bind('click', () => {
                element.toggleClass(scope.className)
            });
        };
        static factory(): ng.IDirectiveFactory {
            return () => new ToggleClass;
        }
    }
}