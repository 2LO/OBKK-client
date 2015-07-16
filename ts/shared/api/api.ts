/// <reference path="./user.ts" />
/// <reference path="./order.ts" />
/// <reference path="./auth.ts"/>

module Shared {
    /** 
     * TODO:
     * Rezultat zwrócony przez server po
     * np. pomyślnym zalogowaniu
     */
    export interface IServerResult extends ng.resource.IResource<IServerResult> {
        code: number;
        data: any;
    }

    /** Wszystkie metody API */
    export interface IApi {
        User: IUserResource;
        Orders: IOrderResource;
        Auth: IAuthResource;
        Gallery: ng.resource.IResourceClass<any>
    }
    export module API {
        export function Api($resource: ng.resource.IResourceService) {
            return <IApi> {
                  User: UserResource($resource)
                , Orders: OrderResource($resource)
                , Auth: AuthResource($resource)
                , Gallery: $resource('/gallery', {}, {})
            };
        }
    }
}