/// <reference path="../_all.ts" />

/**
 * Interfejsy modyfikujące domyślne
 * interfejsy angulara
 */
module Shared {
    /**
     * Nie trzeba w klasie kontrolleru
     * bindować miliona metod i można
     * np. w ng-click='caller.dupa()'
     */
    export interface ICtrlScope<T> extends ng.IScope {
        fn: T;
    }
}
