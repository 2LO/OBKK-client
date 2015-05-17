define([
      'underscore'
    , '../auth'
], function(
      _
    , mod
) {
    return mod
    /** Serwis obsługujący użytkownika */
    .factory('Order', function($resource, $localStorage) {
        var res = $resource('/order'
            , {}
            , {
                list: { method: 'GET', isArray: true }
            });
        return {
            list : _.memoize(res.list)
        }
    });
});
