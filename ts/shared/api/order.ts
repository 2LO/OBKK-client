/// <reference path="../_all.ts" />

module Shared {
    /** Interfejs zamówienia */
    export interface IOrder extends ng.resource.IResource<IOrder> {
        price: number;
        name: string;
    };

    /** Interfejs resource dla zamówień */
    export interface IOrderResource extends ng.resource.IResourceClass<IOrder> {
        list(): IOrder[];
    };

    export module API {
        /** Akcja logowania */
        let listAction: ng.resource.IActionDescriptor = {
              method: 'GET'
            , isArray: true
        };
        export function OrderResource($resource: ng.resource.IResourceService) {
            return <IOrderResource> $resource('/order', {}, {
                list: listAction
            });
        };
    };
};