define([
      'underscore'
    , '../auth'
], function(
      _
    , mod
) {
    return mod
    /** Stałe eventy usera */
    .constant('USER_EVENTS', {
        loginSuccess: 'login-success'
    })
    /** Serwis obsługujący użytkownika */
    .factory('User', function($resource, $localStorage) {
        var res = $resource( '/user/:action'
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

        /** Weryfikacja ważności tokenu */
        if(new Date().getTime()/1000 >= user.exp)
            user = {};

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
                success && success();
            }, error);
        };

        /** Wylogowywanie użytkownika */
        var logout = _.bind($localStorage.$reset, this);
        return (
            { register: res.register
            , login: login
            , logout: logout
            }
        );
    });
});