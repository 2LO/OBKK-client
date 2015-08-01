/// <reference path="../../_all.ts" />

/** Zamiana tytułu strony po wczytaniu state */
module Shared {
    const DEFAULT_TAB_ID = 'dick';

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
            this.current =
                page >= this.total
                    ? 0
                    : (page < 0 ? this.total - 1 : page);
            return this;
        }
        public previous() { this.set(--this.current); }
        public next()     { this.set(++this.current); }

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
            public tab(id: string = DEFAULT_TAB_ID, val?: TabData): TabData {
                return val ? this.data[id] = val : this.data[id];
            }
        }
    }
    export module Directives {
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
                  private $parse: ng.IParseService
                , private tabsManager: Services.TabsManager) {
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
                    scope.$watchGroup([ arrayName, attr.appTabsVisible], data => {
                        /** Dane do renderingu */
                        if(data[0])
                            this.tabsManager
                                .tab( id
                                    , new TabData(
                                          data[0]
                                        , data[1] || parseInt(this.$parse(attr.appTabsVisible)(scope))
                                    ))
                                .array;
                    });

                    /** Kasowanie poprzednich i tworzenie tablicy */
                    let rebuildArray = data => {
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
                    };
                    /** Nasłuchiwanie na zmiany w kliknięciach przycisków */
                    scope.$watch(() => {
                        let tab = this.tabsManager.tab(id);
                        return tab && tab.array;
                    }, rebuildArray);
                };
            };

            static factory(): ng.IDirectiveFactory {
                return ($parse, tabsManager) => new Tabs($parse, tabsManager);
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
                let createButton = (callback: (param: any) => any) => {
                    let created = angular.element('<button class="default"></button>');
                    callback(created);
                    return element.append(this.$compile(created)(scope)) && created;
                };

                // https://groups.google.com/forum/#!topic/angular/S2W4XIyo4oQ
                let createNavigation = () => {
                    /**
                     * Tworzenie grupy przycisków z akcjami
                     * @param {any} pack Paczka przycisków
                     */
                    let createPack = (pack: { [index: string]: any }) => {
                        _(pack).each((val, index: string) => {
                            if(index.length)
                                createButton(btn => {
                                    btn
                                        .html('<i class="fa '+ index + '"></i>')
                                        .on('click', () => {
                                            (<any>val)();
                                            scope.$parent.$digest();
                                        });
                                });
                            else
                                (<any>val)();
                        });
                    };

                    /** Tworzenie numerów stron */
                    let createPageList = () => {
                        /** Tworzenie przycisków stron */
                        _(tab.pages).each((pages: any[], index: number) => {
                            createButton(btn => {
                                btn
                                    .text(index + 1)
                                    .attr( 'ng-class'
                                         , _.template('{ active: tabsManager.tab("<%= tabId %>").current == <%= index %> }')(
                                            { tabId: id
                                            , index: index
                                            })
                                    )
                                    .on('click', () => {
                                        tab.set(index);
                                        scope.$parent.$digest();
                                    });
                            });
                        });
                    };

                    createPack({
                          'fa-angle-double-left': tab.set.bind(tab, 0)
                        , 'fa-angle-left': tab.previous.bind(tab)
                        , '': createPageList
                        , 'fa-angle-right': tab.next.bind(tab)
                        , 'fa-angle-double-right': tab.set.bind(tab, -1)
                    });
                };

                /** Podstawowe metody */
                scope.tabsManager = this.tabsManager;
                scope.$watch(() => {
                    return tab = getTab();
                }, () => {
                    if(!tab)
                        return;

                    element.html('');
                    tab.pages.length > 1 && createNavigation();
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