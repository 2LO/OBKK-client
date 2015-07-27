/// <reference path="../_all.ts" />

module Shared {
    export module Form {
        export interface IMailData {
            title: string;
            body: string;
            receiver: string[];
        }
    }

    export const enum FolderFlag {
          MAIL_GROUPING=    0x1
        , REMOVABLE=        0x2
    }

    /** Nagłówek emaila, brak body w celu optymlizaci */
    export interface IMailHeader {
        _id: string;
        title: string;
        fullName: string;
        date: string;
        read: boolean;
    }

    /** Informacje o użytkowniku dostępne dla odbiorców */
    export interface IMailUser {
        _id: string;
        email: string;
        info: {
            fullName: string;
            name: string;
            surname: string;
        }
    }

    /** Mail po odebraniu */
    export interface IMailContent extends ng.resource.IResource<IMailContent> {
        _id: string;
        body: string;
        date: string;
        receiver: IMailUser;
        sender: IMailUser;
    }

    /** Nagłówek folderu */
    export interface IFolderHeader {
        _id: string;
        name: string;
        icon: string;
    }

    /** Dla parametrów URL */
    export interface IInboxURL {
        folder: string;
        message: string;
    }

    /** Folder z emailami */
    export interface IFolder extends IFolderHeader, ng.resource.IResource<IFolder> {
        flags: number;
        headers: IMailHeader[];
    }

    export interface IInboxResource extends ng.resource.IResourceClass<IFolder> {
        content(data: IInboxURL): IMailContent;
        headers(data: { folder: string; lastDate?: string; }): IFolder;
        receivers(): IMailUser[];
        send(data: Form.IMailData);
    }
    export module API {
        /** Akcja  */
        export function InboxResource($resource: ng.resource.IResourceService) {
            let folderAction: ng.resource.IActionDescriptor = {
                  method: 'GET'
                , params: { action: 'folder' }
            };

            /** Akcja listowania odbiorców wiadomości */
            let receiversAction: ng.resource.IActionDescriptor = {
                  method: 'GET'
                , params: { action: 'receivers' }
                , isArray: true
            };

            return <IInboxResource> $resource('/user/inbox/:action/:folder/:message', {
                  action: '@action'
                , folder: '@folder'
                , message: '@message'
            }, {
                  content: folderAction
                , headers: folderAction
                , receivers: receiversAction
                , send: { method: 'PUT' }
            });
        }
    }
}