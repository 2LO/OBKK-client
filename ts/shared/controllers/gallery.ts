/// <reference path="../_all.ts"/>
/// <reference path="../api/api.ts" />

module Shared.Controllers {
    /**
     * Interfejsy ścieżek zwracanych z serwera
     * url dla ułatwienia parsowania, zwiększa
     * nieco wagę JSONa ale to nic
     */
    interface IFile {
        url: string;
        name: string;
    }
    interface IDir {
        files: IFile[][];
    }

    /** Scope galerii */
    interface IGalleryScope extends ICtrlScope<Gallery>  {
        currentPath: IDir;
        currentFile: IFile;
        pathName: string;
        page: number;
    }

    /** todo: Parametry URL galerii */
    interface IGalleryState extends ng.ui.IState {
        params: {
            path: string;
            file: string;
        };
    }

    /**
     * Galeria posiada foldery i zdjęcia,
     * które renderowane są i grupowane
     */
    export class Gallery extends Controller {
        constructor(
              private $scope: IGalleryScope
            , private $state: IGalleryState
            , private $location: ng.ILocationService
            , private api: IApi
        ) {
            super($scope, {
                  pathName: ''
                , page: 0
            });
            api.Gallery.get().$promise.then(data => {
                this.data = data;
                this
                    .go($state.params.path)
                    .openFile($state.params.file && <IFile> { url: $state.params.file })
            });
        }

        /** Dane galerii odebrane z serwera */
        private data: any = {};

        public get current(): IDir     { return this.$scope.currentPath; }
        public set current(path: IDir) { this.$scope.currentPath = path; }

        /**
         * Otwieranie pliku
         * @param {IFile} file
         */
        public openFile(file: IFile) {
            if(file) {
                this.$scope.currentFile = file;
                this.$location.search('file', encodeURI(file.url));
            }
        }
        public closeFile() {
            this.$location.search('file',  this.$scope.currentFile = null);
        }

        /**
         * Poruszanie się do folderu po ścieżce
         * @param {string} path ścieżka
         */
        private previousPath: string = null;
        public go(path: string = '/') {
            let segments = path.match(/(?:([^\/]*)\/)|(.*\..*)/g);

            /** Jeśli ścieżka jest relatywna to odcinanie './' */
            if(path[0] === '-')
                return this.go(this.previousPath);
            else if(segments[0] === './')
                segments.shift();
            else if(segments[0] === '../') {
                this.previousPath = this.$scope.pathName;
                return this.go(this.$scope.pathName.replace(/([^\/]*\/)$/, ''));
            } else {
                this.$scope.pathName = '';
                this.current = this.data;
            }

            /** Tworzenie absolutnej ścieżki */
            if(/^[^\/.]/.test(path))
                segments.unshift('/');

            /** Poruszanie się po ścieżce */
            _(segments).each(segment => {
                this.current = this.current[segment];
                this.$scope.pathName += segment;
            });

            /** Resetowanie strony */
            this.$scope.page = 0;
            this.$scope.currentFile = null;

            /** Dzielenie listy na chunks */
            this.current = <any> _(this.current).clone();
            this.current.files = <any> this.current.files;

            /** Aktualizowanie URL */
            this.$location
                .search('path', encodeURI(this.$scope.pathName))
                .search('file', null);
            return this;
        }
    }
    mod.controller('GalleryCtrl', Gallery);
}