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
        return $resource( '/order'
                        , {}
                        , { list: { method: 'GET'
                                  , isArray: true 
                                  }
                          });
    });
});