define([ 
    '../mod' 
], function(
    mod
) {
    mod.cache
        .factory('Fupa', function() {
            return { a: 2 };
        })
        .controller('IndexCtrl', function($scope, Fupa) {
            $scope.a = Fupa.a;
        });
});