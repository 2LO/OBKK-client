define([
    '../auth'
], function(
    mod
) {
    return mod
    /** 
     * Kody błędów zwracane tylko w JSON
     * Do każdego zapytania dołączony jest token
     */
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    })
    .factory('authInterceptor', function () {
        return {
            request: function (config) {
                config.headers.Accept = 'application/json, text/javascript';
                return config;
            }
        };
    })

    /** Stałe eventy usera */
    .constant('UserEvents', {
        loginChange: 'login-change'
    })
    /** Serwis obsługujący użytkownika */
    .factory('Auth', function($rootScope, $resource, $localStorage, UserEvents) {
        var res = $resource('/user/:action'
            , {}
            , { register: 
                { method: 'PUT'
                , params: { action: 'register' }
                }
            , login:
                { method: 'POST'
                , params: { action: 'login' }
                }
        });
        /**
         * Parsowanie tokenu
         * @param  {String} token Token
         * @return {Object}       Użytkownik
         */
        var parseToken = function(token) {
            return JSON.parse(atob(/\.(.*)\./.exec(token)[1]));
        };
        /** Zalogowany użytkownik */
        var user = $localStorage.token
                        ? parseToken($localStorage.token)
                        : {};

        /**
         * Logowanie użytkownika do systemu
         * @param  {Assoc} data    Login i Hasło
         * @param  {Func}  error   Callback błędu
         * @param  {Func}  success Callback sukcesu
         */
        var login = function(data, error, success) {
            if(!_.isEmpty(user))
                throw new Error('User must be empty!');

            res.login(data, function(data) {
                /** Ładowanie tokenu do pamięci lokalnej */
                _.extend(user, parseToken(data.token));
                $localStorage.token = data.token;
                /** Jeśli zalgoowano, callback */
                $rootScope.$broadcast(UserEvents.loginChange);
                success && success();
            }, error);
        };

        /** Wylogowywanie użytkownika */
        var logout = function() {
            user = {};
            $localStorage.$reset();
            $rootScope.$broadcast(UserEvents.loginChange);
        };

        /** Weryfikacja ważności tokenu */
        if(new Date().getTime()/1000 >= user.exp)
            logout();

        return (
            { register: res.register
            , login: login
            , logout: logout
            , user: user
            , isLogged: function() { return !_.isEmpty(user); }
            }
        );
    });
});