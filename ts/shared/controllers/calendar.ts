/// <reference path="../_all.ts"/>

/**
 * Kontroller kalendarza, kalendarz
 * posiada różne tryby np. pokazanie
 * wszystkich wykładów z określonego
 * dnia
 */
module Shared.Controllers {
    interface ICalendarScope extends ICtrlScope<Calendar> {
    }

    export class Calendar extends Controller {
        constructor(
            private $scope: ICalendarScope
        ) {
            super($scope);
        }
    }
    mod.controller('CalendarCtrl', Calendar);
}
