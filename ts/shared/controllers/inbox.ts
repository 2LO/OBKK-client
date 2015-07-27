/// <reference path="../_all.ts"/>

/**
 * Kontroller skrzynki pocztowej, zajmuje się ładowaniem
 * widoków nowych folderów i listy wiadomości. Powinien automatycznie
 * ładować nowo przybyłe wiadomości tzn. aktualizować folder
 */
module Shared.Controllers {
    /** Wbudowane skrzynki */
    const enum Inboxes {
          RECEIVED
        , SENT
        , TRASH
    }

    /** Widok inboxa */
    interface IInboxScope extends ICtrlScope<Inbox> {
        folders: IFolderHeader[];
    }
    export class Inbox extends Controller {
        constructor(
              public $scope: IInboxScope
            , private $state: ng.ui.IStateService
            , private api: IApi
        ) {
            super($scope);
            api.Inbox.query().$promise.then(data => {
                $scope.folders = data;
                if(_.isEmpty($state.params))
                    this.openFolder();
            });
        }

        /**
         * Otwieranie folderu
         * @param {string} folderId Identyfikator folderu
         * @param {any}    params   Opcje ui.router'a
         */
        private openFolder( folderId: string = this.$scope.folders[0]._id
                          , params: any = {}) {
            this.$state.go('inbox.folder', { folder: folderId }, params);
        }

        /** Odświeżanie skrzynki */
        public refresh() {
            this.openFolder((<any> this.$state.params).folder);
        }
    }

    /** Widok folderu, emaile są grupowane */
    class Folder extends Controller {
        constructor(
              private $scope: { headers: IMailHeader[][] }
            , private $stateParams: IInboxURL
            , private $interval: ng.IIntervalService
            , private api: IApi
        ) {
            super($scope);

            /** Wstępne wczytywanie nagłówków wszystko */
            api.Inbox
                .headers($stateParams)
                .$promise.then(this.setFolder.bind(this));

            /** Pobieranie co 5s nowych wiadomości */
            $interval(() => {
                if(this.$scope.headers.length)
                    api.Inbox
                        .headers(
                            _($stateParams).extend({
                                lastDate: this.$scope.headers[0][0].date
                            }))
                        .$promise.then(this.concatFolder.bind(this));
            }, 2000);
        }

        /**
         * Łączenie folderów ponowne tworzenie listy
         * @param {IFolder} folder Folder
         */
        private concatFolder(folder: IFolder) {
            this.setFolder(
                  (this.cache.headers = folder.headers.concat(_(this.cache.headers).flatten()))
                && this.cache);
        }

        /**
         * Wczytywanie listy nagłówków z folderu
         * @param {IFolder} data Folder z niepogrupowanymi nagłówkami
         */
        private cache: IFolder = null;
        private setFolder(data: IFolder = this.cache) {
            this.$scope.headers = [];
            this.cache = data;

            if(data.flags & FolderFlag.MAIL_GROUPING)
                _(data.headers).each((mail: any, index: number) => {
                    let lastGroup = this.$scope.headers[this.$scope.headers.length - 1];
                    if(!index || (<any> lastGroup).last().fullName !== mail.fullName)
                        this.$scope.headers.push([ mail ]);
                    else
                        lastGroup.push(mail);
                });
            else if(data.headers.length)
                this.$scope.headers[0] = data.headers;

            return data;
        }
    }

    /** Widok odebranej wiadomości */
    class View extends Controller {
        constructor(
              private $scope: { data: IMailContent }
            , private $stateParams: IInboxURL
            , private $state: ng.ui.IStateService
            , private api: IApi
        ) {
            super($scope);
            api.Inbox.content($stateParams).$promise.then(data => {
                $scope.data = data;
            });
        }

        /** Zamykanie emaila */
        public close() {
            this.$state.go('inbox.folder', { folder: this.$stateParams.folder });
        }
    }

    /** Widok tworzenia emaila */
    interface IComposeScope extends ng.IScope {
        error: string;
        form: Form.IMailData;
        receivers: IMailUser[];
        $parent: IInboxScope;
    }
    class Compose extends Controller {
        constructor(
              private $scope: IComposeScope
            , private $state: ng.ui.IStateService
            , private api: IApi
        ) {
            super($scope, {
                  receivers: api.Inbox.receivers()
                , form: {
                      title: ''
                    , body: ''
                    , receiver: []
                }
            });
        }

        /** Wysyłanie maila */
        public sendMail() {
            if(this.$scope.form.receiver.length) {
                this.api.Inbox
                    .send(this.$scope.form)
                    .$promise.then(() => {
                        this.$state.go('inbox.folder', {
                            folder: this.$scope.$parent.folders[Inboxes.SENT]._id
                        });
                    });
            } else
                this.$scope.error = 'Brak odbiorcy wiadomości :(';
        }
    }

    mod
        .controller('InboxCtrl', Inbox)
        .controller('InboxCtrl.FolderCtrl', Folder)
        .controller('InboxCtrl.ViewCtrl', View)
        .controller('InboxCtrl.ComposeCtrl', Compose);
}