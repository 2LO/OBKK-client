/** Wczytywanie less */
require([
      'css!../lib/semantic/dist/semantic.min'
    , 'css!../lib/angular-loading-bar/build/loading-bar.min'
    , 'less!../less/main.less'
]);
/** Bootstrapowanie aplikacji */
define([
      'domReady'
    , 'semantic'
    , 'app'

    , 'controllers/layout-ctrl'
    , 'controllers/home-ctrl'
    , 'directives/app-dir'
], function(domReady) {
    domReady(function() {
        angular.bootstrap(document, [ 'app' ]);
    });
});