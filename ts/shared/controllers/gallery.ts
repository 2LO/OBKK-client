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
        path: string;
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
            , private api: IApi
        ) {
            super($scope, {
                  pathName: ''
                , page: 0
            });
            api.Gallery.get().$promise.then(data => {
                this.data = data;
                this.go($state.params.path || '/');
            });
        }

        /** Dane galerii odebrane z serwera */
        private data: any = {};

        /** Aktualna ścieżka */
        public get current(): IDir     { return this.$scope.currentPath; }
        public set current(path: IDir) { this.$scope.currentPath = path; }

        public openFile(file: IFile) {
            this.$scope.currentFile = file;
        }

        /**
         * Poruszanie się do folderu po ścieżce
         * @param {string} path ścieżka
         */
        private previousPath: string = null;
        public go(path: string) {
            if(!path.length)
                return this.current;

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
            return this.current;
        }
    }
    mod.controller('GalleryCtrl', Gallery);
}