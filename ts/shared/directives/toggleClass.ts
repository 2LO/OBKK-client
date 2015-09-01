/// <reference path="../../_all.ts" />

/** Ustawianie klasy na obiekt po wciśnięciu, domyślnie extend */
module Shared.Directives {
    interface IToggleScope extends ng.IScope {
        className: string;
        toggled: string;
    }

    export class ToggleClass implements ng.IDirective {
        public restrict: string = 'A';
        public scope = {
              className: '@ngToggleClass'
            , toggled: '=?ngToggled'
        };

        public link: ng.IDirectiveLinkFn = (scope: IToggleScope, element: ng.IAugmentedJQuery) => {
            // bug: element.bind('click', <any> element.toggleClass.bind(element, scope.className));
            let toggle = function() {
                element.toggleClass(
                    scope.className === 'ng-toggle-class' || !scope.className.length
                        ? 'active'
                        : scope.className)
            };
            if(!_.isUndefined(scope.toggled))
                toggle();
            element.bind('click', toggle);
        };
        static factory(): ng.IDirectiveFactory {
            return () => new ToggleClass;
        }
    }
    mod.directive('ngToggleClass', Directives.ToggleClass.factory());
}