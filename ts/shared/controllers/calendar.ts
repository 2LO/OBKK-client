/**
 * Kontroller kalendarza, kalendarz
 * posiada różne tryby np. pokazanie
 * wszystkich wykładów z określonego
 * dnia
 */
module Shared.Controllers {
    interface ICalendarScope extends ICtrlScope<Calendar> {
    }

    export class Calendar {
        constructor(
            private $scope: ICalendarScope
        ) {
            $scope.fn = this;
        }
    }
}
