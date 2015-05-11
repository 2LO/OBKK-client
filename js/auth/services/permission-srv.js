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
                if(data.anonymous === Auth.isLogged())
                    return false;
                
                /** Wymagania modułów */
                if( !_.isUndefined(data.mods)
                        && _.difference(data.mods, _.pluck(Auth.user.groups, 'name')).length)
                    return false;
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
            var data = toState.data;

            /** 
             * Jeśli posiada własną funckję autoryzującą 
             * to rozszerzane są uprawnienia
             */
            if(data && _.isFunction(data.authorize))
                _.extend(data, data.authorize(toParams));

            if(!Permission.check(data)) {
                $state.go('error', { name: ERROR_CODE['unauthorized'] });
                event.preventDefault();
            }
        });
    });
});