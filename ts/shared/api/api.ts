/// <reference path="../_all.ts" />
/// <reference path="./user.ts" />
/// <reference path="./order.ts" />
/// <reference path="./news.ts" />
/// <reference path="./auth.ts"/>
/// <reference path="./inbox.ts"/>

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
        Auth: IAuthResource;
        Orders: IOrderResource;
        News: INewsResource;
        Inbox: IInboxResource;
        Gallery: ng.resource.IResourceClass<any>;
    }
    export module API {
        export function Api($resource: ng.resource.IResourceService) {
            return <IApi> {
                  User: UserResource($resource)
                , Auth: AuthResource($resource)
                , Orders: OrderResource($resource)
                , News: NewsResource($resource)
                , Inbox: InboxResource($resource)
                , Gallery: $resource('/gallery', {}, {})
            };
        }
        mod.factory('api', Api);
    }
}