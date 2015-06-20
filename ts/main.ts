/// <reference path="./_all.ts" />
/// <reference path="./shared/_all.ts" />

'use strict';
module Application {
    let coreMods = [
          'ui.router'
        , 'ngResource'
        , 'ngStorage'
        , 'shared'
    ];
    angular.module('app', coreMods);
};
(() => {
    angular
        .element(document)
        .ready(angular.bootstrap.bind(null, document, [ 'app' ]));
})();
