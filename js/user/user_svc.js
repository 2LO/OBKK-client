define([
    './user'
], function(
    mod
) {
    return mod.factory('User', function($resource) {
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
         * Logowanie użytkownika, dekodowanie tokenu
         * @param  {Assoc}  data    {login:'', pass:''}
         */
        var login = function(data) {
            /**
             * Pomyślne zalogowanie
             * @param  {Assoc} data  Access Token
             */
            var success = function(data) {
                /** TODO: Zapisywanie tokena */
                var token = data.token
                  , user  = JSON.parse(atob(/\.(.*)\./.exec(token)[1]));
                console.log(user);
            };
            /**
             * Błąd logowania
             * @param  {Assoc} error Wartość błedu
             */
            var error = function(error) {

            };
            res.login(data, success, error);
        };
        return (
            { register: res.register
            , login: login
            }
        );
    });
});