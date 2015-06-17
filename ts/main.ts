/// <reference path="../data/ts_def/angularjs/angular.d.ts" />
class HomeCtrl {
    public static $inject = [
        '$scope'
    ];
    constructor( private $scope) {
        console.log($scope);
    }
};

let app = angular.module('app', [])
    .controller('HomeCtrl', HomeCtrl);

angular
    .element(document)
    .ready(angular.bootstrap.bind(null, document, [ 'app' ]));
