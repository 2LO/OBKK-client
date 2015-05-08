define([
    '../app'
], function(
    mod
) {
    return mod
    .controller('LayoutCtrl', function($state, $rootScope, $scope, Auth, UserEvents) {
        /** Przycisk wylogowania */
        $scope.logout = function() {
            Auth.logout();
            $state.go('login');
        };

        /** Informacje o użytkowniku */
        $rootScope.$on(UserEvents.loginChange, function() {
            $scope.userName = Auth.user.email;
        });
        $scope.userName = Auth.user.email;
    });
});