/// <reference path="../_all.ts"/>
/// <reference path="../api/api.ts" />

module Shared.Controllers {
    interface INewsScope extends ICtrlScope<News>  {
        data: INewsGroup;
        form: {
            message: string;
        };
    }

    /** Newsy posiadają typy i renderowane są na stronie głównej */
    export class News extends Controller {
        constructor(
              private $scope: INewsScope
            , private $timeout: ng.ITimeoutService
            , private api: IApi
        ) {
            super($scope, {
                form: { message: '' }
            });
            this.reload();
        }

        /** Ponowne wczytywanie listy postów */
        private reload() {
            this.api.News
                .get()
                .$promise
                .then(this.loadNews.bind(this));
        }

        /**
         * Parsowanie tablicy z informacjami
         * @param {INewsGroup} data Informacje o tablicy
         */
        private static messages: { [index: number]: string } = {
              0x1: 'Rejestracja użytkownika'
            , 0x2: 'Rejestracja firmy'
        };
        private loadNews(data: INewsGroup) {
            /** Grupowanie tylko newsów */
            (this.$scope.data = data)
                .news = <any>
                    (<any>_(data.news)).groupFlatten(feed => {
                        return feed.user._id;
                    });
        }

        /**
         * Wysyłanie wiadomości na stronę
         * aktualności, powinno automatycznie
         * się dodać na głównej
         *
         */
        public sendFeed() {
            this.api.News
                .save(<Form.INews> {
                      type: NewsType.POST
                    , data: {
                        msg: this.$scope.form.message
                    }
                }, _(this.$timeout).partial(this.reload.bind(this), 400));
            this.$scope.form.message = '';
        }
    }
    mod.controller('NewsCtrl', News);
}