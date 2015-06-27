/// <reference path="../../_all.ts" />

/**
 * Zastępowanie XXX-XXX-XXX w textboxie na
 * ciąg znaków np. 123-456-789, automatyczne
 * wstawanie znaków z szablonu
 */
module Shared.Directives {
    interface IPlaceholderAttrs extends ng.IAttributes {
        ngPlaceholder: string;
    };

    export class Placeholder implements ng.IDirective {
        public restrict: string = 'A';

        link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: any) => {
            let placeholder = attrs.ngPlaceholder;
            element
                .attr('placeholder', placeholder)
                .attr('maxlength', placeholder.length);

            scope.$watch(attrs.ngModel, this.match.bind(this, placeholder, element))
        };

        /**
         * Zamienianie ciągów znaków na maskę na watch'u
         * @param {string}              pattern Maska
         * @param {ng.IAugmentedJQuery} element Element DOM
         * @param {string}              val     Wartość elementu DOM z Controller'a
         */
        private match(pattern: string, element: ng.IAugmentedJQuery, val: string) {
            if(typeof val === 'undefined')
                return;

            /** Automatyczne przeskakiwanie do szablonu */
            let index = val.length - 1;
            if(index + 1 < pattern.length && !/^[CD]$/.test(pattern[index + 1]))
                val += pattern[index + 1];
            
            /** todo: przywracanie pozycji kursora */
            element.val(val);
        };


        static factory(): ng.IDirectiveFactory {
            return () => new Placeholder;
        };
    };
};