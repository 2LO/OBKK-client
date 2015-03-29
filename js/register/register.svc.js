define([
    './register'
], function(
    mod
) {
    return mod.factory('register', function($resource) {
        return $resource( '/user/register'
                        , {}
                        , { register: 
                            { method: 'PUT'
                            , params: 
                                { user: '@user'
                                , company: '@company'
                                }
                            }
                        });
    });
});