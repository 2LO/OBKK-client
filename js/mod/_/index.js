define([ 
    '../mod' 
], function(
    mod
) {
    console.log(_.chain(mod.cache));
    mod.cache.factory('Fupa', function() {
        return { a: 2 };
    });
    mod.cache.controller('IndexCtrl', function($scope, Fupa) {
        $scope.a = Fupa.a;
    });
});