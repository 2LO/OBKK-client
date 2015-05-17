define([
    '../auth'
], function(
    mod
) {
    return mod
    /** Kontroller rejestacji */
    .controller('RegisterCtrl', function($scope, $state, Auth, Order) {
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

        /** Rejestracja użytkownika */
        $scope.orders = Order.list();
        $scope.form = { 
              user: { orders: [] }
            , company: {}
        };

        /** Obserwowanie listy */
        $scope.$watchCollection('form.user.orders', function(o) {
            $scope.totalCost = _.reduce($scope.form.user.orders
                , function(mem, el) {
                    return mem + el.price;
            }, 0)
        });
        $scope.register = function() {
            Auth.register($scope.form, function() {
                $state.transitionTo('register.confirm');
            }, function(error) {
                $scope.error = error.data.message;
            });
        };
    });
});
