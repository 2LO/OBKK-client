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
        /**
         * Logowanie użytkownika do systemu
         * @param  {Assoc} data    Login i Hasło
         * @param  {Func}  error   Callback błędu
         * @param  {Func}  success Callback sukcesu
         */
        var login = function(data, error, success) {
            console.log(user);
            if(!_.isEmpty(user))
                throw new Error('User must be empty!');
            res.login(data, function(data) {
                /** Ładowanie tokenu do pamięci lokalnej */
                _.extend(user, parseToken(data.token));
                $localStorage.token = data.token;
                success && success();
            }, error);
        };
        return (
            { register: res.register
            , login: login
            }
        );
    });
});