define([
    '../app'
], function(
    mod
) {
    return mod
    .controller('MenuCtrl', function($state) {
        $scope.$on("$stateChangeSuccess", function() {
            $scope.state = $state.current.name;
        }); 
    });
});