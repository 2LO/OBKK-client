define([
    './register'
], function(
    mod
) {
    return mod.controller('RegisterCtrl', function($scope, $state, User) {
        var Step = function(title, subtitle, icon, state) {
            this.title = title;
            this.subtitle = subtitle;
            this.icon = icon;
            this.state = state;
        };
        $scope.steps = 
            { active: 0
            , list: 
                [ new Step('Rejestracja', 'Tworzenie nowego konta', 'truck', 'register.confirm')
                , new Step('Potwierdzenie', 'Rejestracji konta', 'info', 'register.info')
                ]
            };
        $scope.form = {};
        $scope.nextStep = function() {
            $scope.steps.active = ++$scope.steps.active >= $scope.steps.list.length
                                    ? 0
                                    : $scope.steps.active;
            $state.go('register.confirm');
            User.register($scope.form);
        };
    });
});