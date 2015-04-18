define([
      'underscore'
    , '../auth'
], function(
      _
    , mod
) {
    return mod
    /** Kontroller okienka logowania, przekierowuje do rejestacji */
    .controller('LoginCtrl', function($scope, $state, User) {
        /** Logowanie użytkownika */
        $scope.form = {};
        $scope.login = _.bind( User.login
                             , this
                             , $scope.form
                             , function(error) {
            $scope.error = error.data.message;
        });
    });
});