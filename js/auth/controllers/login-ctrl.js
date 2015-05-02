define([
    '../auth'
], function(
    mod
) {
    return mod
    /** Kontroller okienka logowania, przekierowuje do rejestacji */
    .controller('LoginCtrl', function($scope, $state, Auth) {
        /** Logowanie użytkownika */
        $scope.form = {};
        $scope.login = _.bind( Auth.login
                             , this
                             , $scope.form
                             , function(error) {
            $scope.error = error.data.message;
        });
    });
});