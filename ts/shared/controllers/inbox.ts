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
            this.openFolder((<any> this.$state.params).folder, { reload: true });
        }
    }

    /** Widok folderu, emaile są grupowane */
    interface IHeaderLabel extends IMailHeader {
        nested?: boolean; /** Jeśli jest zgrupowany */
    }
    interface IFolderScope extends ICtrlScope<Folder> {
        headers: IHeaderLabel[];
        visible: number;
    }
    class Folder extends Controller {
        constructor(
              private $scope: IFolderScope
            , private $stateParams: IInboxURL
            , private $interval: ng.IIntervalService
            , private api: IApi
            , private tabsManager: Services.TabsManager
        ) {
            super($scope, {
                visible: 20
            });

            /** Wstępne wczytywanie nagłówków wszystko */
            api.Inbox
                .headers($stateParams)
                .$promise.then(this.setFolder.bind(this));

            /**
             * Pobieranie co 5s nowych wiadomości tylko
             * na pierwszej stronie jeśli jest otwarta
             */
            $interval(() => {
                if(this.$scope.headers.length && !tabsManager.tab().current)
                    api.Inbox
                        .headers(
                            _($stateParams).extend({
                                lastDate: this.$scope.headers[0].date
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
                  (this.cache.headers = folder.headers.concat(this.cache.headers))
                && this.cache);
        }

        /**
         * Wczytywanie listy nagłówków z folderu
         * @param {IFolder} data Folder z niepogrupowanymi nagłówkami
         */
        private cache: IFolder = null;
        private setFolder(data: IFolder = this.cache) {
            this.$scope.headers = data.headers;
            this.cache = data;

            /** Grupowanie jest nie do [ [], [] ] bo wtedy cężej rozbić na strony */
            if(data.flags & FolderFlag.MAIL_GROUPING) {
                _(data.headers).each((element: IHeaderLabel, index: number) => {
                    if(index >= 1 && element.fullName === data.headers[index - 1].fullName)
                        element.nested = true;
                });
            }
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
            this.$state.go(
                  'inbox.folder'
                , { folder: this.$stateParams.folder });
        }

        /**
         * Odpowiedź na emaila, przenoszenie na formę
         * tworzenia email'a
         */
        public reply() {
            this.$state.go(
                  'inbox.compose'
                , { reply: this.$scope.data });
        }

        /** Kasowanie emaila */
        public remove() {
            this.close();
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
            , private $stateParams: { reply: IMailContent }
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
            if($stateParams.reply)
                this.reply($stateParams.reply);
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

        /**
         * Odpowiadanie na emaila
         * @param {IMailContent} mail Wiadomość, na którą się odpowiada
         */
        public reply(mail: IMailContent) {
            let form = this.$scope.form;

            /** Dodawanie odbiorcy */
            form.receiver.push(mail.sender._id);

            /** Tytuł, trochę lamerskie */
            if(!/RE:/.test(form.title = mail.title))
                form.title = 'RE: ' + form.title;

            /** Cytowanie */
            form.body = _.template(
                'W dniu <%= date %> <%= fullName %> napisał:\n<%= divider %>\n<%= body %>\n<%= divider %>\n'
            )({
                  date: mail.date
                , fullName: mail.sender.info.fullName
                , body: mail.body.replace( /(^|\n)/g, '\n   ')
                , divider: '----------------------------'
            });
        }
    }

    mod
        .controller('InboxCtrl', Inbox)
        .controller('InboxCtrl.FolderCtrl', Folder)
        .controller('InboxCtrl.ViewCtrl', View)
        .controller('InboxCtrl.ComposeCtrl', Compose);
}