/// <reference path="../../_all.ts" />

/** Zamiana tytułu strony po wczytaniu state */
module Shared {
    /** Dane pojedynczej karty */
    class TabData {
        constructor(
              array: any[]                 /** dane */
            , public visible: number       /** ilość widocznych elementów */
            , public current: number = 0   /** aktualny element */
        ) {
            this.array = array;
        }

        /** gettery */
        public set(page: number) {
            this.current = page > this.total ? 0 : page;
            return this;
        }
        public previous = this.set.bind(this, this.current - 1);
        public next     = this.set.bind(this, this.current + 1);

        /** zliaczanie rozmiarów elementów */
        private chunks: any[] = [];
        private total: number = 0;

        public get array(): any[] {
            return this.chunks[this.current];
        }
        public set array(array: any[]) {
            if(array) {
                this.chunks = (<any> _(array)).chunk(this.visible);
                this.total = this.chunks.length;
            }
        }
        public get pages(): any[]       { return this.chunks; }
        public get totalPages(): number { return this.chunks.length; }
    }
    export module Services {
        /** Menedżer zakładek */
        export class TabsManager {
            /**
             * Zaznaczanie używanej karty
             * @param {string} id  Identyfikator karty
             * @param {string} val Zawartość karty
             */
            private data: { [index: string]: TabData } = {};
            public tab(id: string, val?: TabData): TabData {
                return val ? this.data[id] = val : this.data[id];
            }
        }
    }
    export module Directives {
        const DEFAULT_TAB_ID = 'dick';

        /**
         * Ref:
         * http://liamkaufman.com/blog/2013/05/13/understanding-angularjs-directives-part1-ng-repeat-and-compile/
         * https://groups.google.com/forum/#!msg/angular/an9QpzqIYiM/r8v-3W1X5vcJ
         * http://stackoverflow.com/questions/19470138/ng-repeats-compile-and-link-functions
         * Dyrektywa zamieniająca tabsy na ng-repeat i wstawiająca
         * klasę zakładek do $scope, implementacja mogłaby być zroniona
         * jako allias na ng-repeat z filtrem ze startem i końcem ale
         * rozbicie na chunki powinno być optymalniejsze i prostsze w kodowaniu
         */
        interface IScopeElement {
            scope: ng.IScope;
            element: ng.IAugmentedJQuery;
        }
        interface ITabsAttrs extends ng.IAttributes {
            appTabs: string;
            appTabsVisible: string;
            appTabsId: string;
        }
        export class Tabs implements ng.IDirective {
            public priority: number    = 5000;
            public terminal: boolean   = true;
            public transclude: string  = 'element';
            // bug? todo: Debug
            // public scope = {
            //       repeat: '@appTabs'
            //     , pages:  '@appTabsLimit'
            // };

            constructor(
                private tabsManager: Services.TabsManager) {
            }

            /** Podmienianie na ng-repeat */
            public compile: ng.IDirectiveCompileFn =
                        ( element: ng.IAugmentedJQuery
                        , attr: ITabsAttrs
                        , linker: any) => {
                /** Regexp wycina z (index, value) in dupa wartosci index, value, dupa */
                let regex = _.compact(
                    attr.appTabs.match(
                        /^(?:\((\w*)\,.(\w*)\)|(\w*)).in.(.*)$/
                    )
                );

                /** Nazwy elementów */
                let arrayName = regex[regex.length - 1]
                  , valueName = regex[regex.length - 2]
                  , indexName = regex.length === 3 ? 'index' : regex[regex.length - 3 ]
                  , elements: IScopeElement[] = []
                  , id = attr.appTabsId || DEFAULT_TAB_ID;
                return (scope: ng.IScope, $element) => {
                    /** Obserwowanie tablicy kontrolera i rozdzielanie jej na części */
                    scope.$watch(arrayName, array => {
                        /** Dane do renderingu */
                        this.tabsManager
                            .tab( id
                                , new TabData(
                                    array
                                    , parseInt(attr.appTabsVisible)
                                ))
                            .array;
                    });

                    /** Nasłuchiwanie na zmiany w kliknięciach przycisków */
                    scope.$watch(() => {
                        return this.tabsManager.tab(id).array;
                    }, (data) => {
                        /** kasowanie poprzednich danych */
                        elements = _(elements).reject((el: IScopeElement) => {
                            el.element.remove();
                            el.scope.$destroy();
                            return true;
                        });
                        _(data).each((value, index) => {
                            let childScope = scope.$new();
                            childScope[indexName] = index;
                            childScope[valueName] = value;
                            linker(childScope, clone => {
                                $element.parent().append(clone);
                                elements.push({
                                      scope: childScope
                                    , element: clone
                                });
                            });
                        });
                    });
                };
            };

            static factory(): ng.IDirectiveFactory {
                return tabsManager => new Tabs(tabsManager);
            }
        }

        /** Przyciski nawigacyjne dla zakładek */
        interface ITabsBtnsScope extends ng.IScope {
            tabId: string;
            tabsManager: Services.TabsManager;
        }
        export class TabsButtons implements ng.IDirective {
            public restrict: string  = 'A';
            public terminal: boolean = true;
            public priority: number  = 1000;
            public transclude: boolean = true;
            public scope = {
                tabId: '@TabsButtonsId'
            };

            constructor(
                  private $compile: ng.ICompileService
                , private tabsManager: Services.TabsManager
            ) {
            }

            public link: ng.IDirectiveLinkFn = (scope: ITabsBtnsScope, element: ng.IAugmentedJQuery) => {
                let id: string = scope.tabId || DEFAULT_TAB_ID
                  , tab: TabData = null
                  , getTab = (): TabData => {
                        return this.tabsManager.tab(id);
                    };
                /** Konfiguracja elementu */
                element.addClass('btn-group');

                /** Podstawowe metody */
                scope.tabsManager = this.tabsManager;
                scope.$watch(() => {
                    return tab = getTab();
                }, () => {
                    // https://groups.google.com/forum/#!topic/angular/S2W4XIyo4oQ
                    element.html('');
                    if(tab.pages.length > 1)
                        _(tab.pages).each((pages: any[], index: number) => {
                            let created = angular.element('<button class="default"></button>');
                            created
                                .text(index + 1)
                                .attr( 'ng-class'
                                     , _.template('{ active: tabsManager.tab("<%= tabId %>").current == <%= index %> }')(
                                        { tabId: id
                                        , index: index
                                        })
                                     )
                                .on('click', () => {
                                    this.tabsManager.tab(id).set(index);
                                    scope.$parent.$digest();
                                });
                            element.append(this.$compile(created)(scope));
                        });
                });
            };

            static factory(): ng.IDirectiveFactory {
                return ($compile, tabsManager) => new TabsButtons($compile, tabsManager);
            }
        }
    }
    mod
        .service('tabsManager', Services.TabsManager)
        .directive('appTabs', Directives.Tabs.factory())
        .directive('appTabsButtons', Directives.TabsButtons.factory());
}