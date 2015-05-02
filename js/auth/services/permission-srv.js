define([
    '../auth'
], function(
    mod
) {
    return mod
    /** Serwis obsługujący użytkownika */
    .factory('Permission', function(Auth) {
        /**
         * Sprawdzanie przyzwoleń
         * @param  {Assoc} data Dane 
         * @return {Bool}  Przywzolenie na korzystanie z zasobów    
         */
        var checkPermission = function(data) {
            if(!_.isUndefined(data)) {
                /** Wymaganie zalogowania */
                if(data.anonymous === Auth.isLogged()) return false;
            }
            return true;
        };
        return (
            { check: checkPermission
            }
        );
    })
    /** Weryfikacja uprawnień */
    .run(function($rootScope, $state, ERROR_CODE, Permission) {
        $rootScope.$on( '$stateChangeStart'
                      , function(event, toState, toParams, fromState, fromParams) {
            /** Weryfikacja uprawnień */
            if(!Permission.check(toState.data)) {
                $state.go('error', { name: ERROR_CODE['unauthorized'] });
                event.preventDefault();
            }
        });
    });
});