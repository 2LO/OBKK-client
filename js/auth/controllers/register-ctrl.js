define([
    '../auth'
], function(
    mod
) {
    return mod
    /** Kontroller rejestacji */
    .controller('RegisterCtrl', function($scope, $state, User) {
        var Step = function(title, subtitle, icon, state) {
            this.title = title;
            this.subtitle = subtitle;
            this.icon = icon;
            this.state = state;
        };

        /** Lista kroków */
        $scope.steps = [ 
              new Step('Rejestracja', 'Tworzenie nowego konta', 'truck', 'register.info')
            , new Step('Potwierdzenie', 'Rejestracji konta', 'info', 'register.confirm')
        ];
        $scope.$on("$stateChangeSuccess", function() {
            $scope.state = $state.current.name;
        });  

        /** Rejestracja użytkownika */
        $scope.form = {};
        $scope.register = function() {
            User.register($scope.form, function() {
                $state.transitionTo('register.confirm');
            }, function(error) {
                $scope.error = error.data.message;
            });
        };
    });
});