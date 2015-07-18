/// <reference path="../_all.ts" />

/**
 * Newsy to informacje na stronie głównej
 * wyświetlane jak lista, z odpowiednimi
 * ikonami
 */
module Shared {
    export module Form {
        /** Post na stronie wysyłany z pola tekstowego */
        export interface INews {
            type: number;
            data?: {
                msg: string;
            };
        }
    }

    /** Typ newsa */
    export const enum NewsType {
          REGISTER=         0x1
        , COMPANY_REGISTER= 0x2
        , POST=             0x3
    }

    /** Klasy newsów */
    export interface INews {
        _id: string;
        user: {
            _id: string;
            name: string;
            surname: string;
        };
        type: NewsType
    }
    export interface INewsGroup extends ng.resource.IResource<INewsGroup> {
        posts: INews[];
        news:  INews[];
    }

    /** Tylko get dlatego pusty */
    export interface INewsResource extends ng.resource.IResourceClass<INewsGroup> {
    }
    export module API {
        export function NewsResource($resource: ng.resource.IResourceService) {
            return <INewsResource> $resource('/news', {}, {
                  get:  { method: 'GET' }
                , save: { method: 'POST' }
            });
        }
    }
}
