/// <reference path="./user.ts" />
/// <reference path="./order.ts" />

module Shared {
    export interface IApi {
        User: IUserResource
        Orders: IOrderResource
    };

    export module API {
        export function Api($resource: ng.resource.IResourceService) {
            return <IApi> {
                 User: UserResource($resource)
               , Orders: OrderResource($resource)
            };
        };
    };
};