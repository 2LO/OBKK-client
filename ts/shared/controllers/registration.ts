/// <reference path="../api/api.ts" />

/**
 * Kontroller paska menu strony, 
 * pokazuje powiadomienia itp.
 */
module Shared.Controllers {
    interface IRegistrationScope extends ICtrlScope<Registration> {
        form: IRegistrationForm;
        orders: IOrder[];
        totalCost: number;
    };

    export class Registration {
        constructor(
              private $scope: IRegistrationScope
            , private api: IApi
        ) {
            $scope.fn = this;

            /** Pobieranie listy ofert cenowych */
            api.Orders.list().$promise.then(data => {
                $scope.orders = data;
            });
            $scope.form = <IRegistrationForm> {
                user: {
                    orders: []
                }
            };

            /** 
             * Na podstawie modyfikacji listy z checkbox
             * sumują się listy
             */
            $scope.totalCost = 0;
            $scope.$watchCollection('form.user.orders', function(o) {
                $scope.totalCost = _.reduce($scope.form.user.orders
                    , (mem, el: IOrder) => mem + el.price
                    , 0)
            });
        };

        /**
         * Rejestracja użytkownika wywoływana 
         * przy ng-submit w formularzu
         */
        public register() {
            console.log(this.$scope.form);
        };
    };
};