/**
 * Uchwyt do modułu AngularJS, który
 * wykorzystują inne kontrolery, serwisy
 */
define([
            'angular',
            'underscore'
        ], function(angular, _) {
    var app = angular.module('app', []);
    app
        .filter('range', function() {
            return function(input, total) {
                total = parseInt(total);
                for (var i=0; i<total; i++)
                    input.push(i);
                return input;
            };
        })
        .filter('slice', function () {
            return function (arr, start, end) {
                return arr.slice(start, end);
            };
        })
        .filter('int', function () {
            return function (val) {
                return parseInt(val);
            };
        })
        .filter('ceil', function () {
            return function (val) {
                return parseInt(Math.ceil(val));
            };
        })
        .controller('a', function($scope) {
            $scope.dupa = 'ss';
        });
    return app;
});