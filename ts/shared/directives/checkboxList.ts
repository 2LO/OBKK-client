/// <reference path="../../_all.ts" />

/*
 * Po zaznaczeniu checkboxa jest on usuwany lub dodawany
 * do listy
 */
module Shared.Directives {
    interface IListScope extends ng.IScope {
        list: any[];
        value: string;
    };

    export class CheckboxList implements ng.IDirective {
        public restrict: string = 'A';
        public scope = {
              list: '=ngCheckboxList' 
            , value: '=ngCheckboxValue' 
        };

        link: ng.IDirectiveLinkFn = (scope: IListScope, element: ng.IAugmentedJQuery, attrs: any) => {
            element.bind('change', () => {
                scope.$apply(this.modifyList.bind(this, scope, element));
            });
        };

        /**
         * Aktualizowanie informacji w liście dla checkbox'ów
         * @param {IListScope}          scope   Scope
         * @param {ng.IAugmentedJQuery} element Element DOM
         */
        private modifyList(scope: IListScope, element: ng.IAugmentedJQuery) {
            if(element.attr('checked')) {
                if(!_.contains(scope.list, scope.value))
                    scope.list.push(scope.value);
            } else {
                scope.list = _.without( scope.list
                                      , _.findWhere(scope.list, scope.value));
            }
        };

        static factory(): ng.IDirectiveFactory {
            return () => new CheckboxList;
        };
    };
};