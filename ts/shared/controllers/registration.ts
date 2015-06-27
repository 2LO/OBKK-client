/// <reference path="../api/api.ts" />

/**
 * Kontroller paska menu strony, 
 * pokazuje powiadomienia itp.
 */
module Shared.Controllers {
    export class Registration {
        constructor(
              private $scope: any
            , private api: IApi
        ) {
            $scope.caller = this;

            /** Pobieranie listy ofert cenowych */
            api.Orders.list().$promise.then(data => {
                $scope.orders = data;
            });
            $scope.form = {
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
    };
};