define([
    './user'
], function(mod) {
    return mod.factory('User', function($resource) {
        return $resource('/user/:action', {}, {
            register: {
                method: 'PUT',
                params: {
                    action: 'register'
                }
            }
        });
    });
});