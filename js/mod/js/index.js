define([ 
      'underscore'
    , '../mod' 
], function(
      _
    , mod
) {
    mod.api
        .factory('Users', function($resource) {
            return $resource('/users/:id'
                , {}
                , { 
                    list: { 
                          method: 'GET' 
                        , isArray: true
                    }
                });
        })
        .controller('IndexCtrl', function($scope, Users) {
            $scope.list = Users.list();
            $scope.selectAll = function() {
                _($scope.list).each(function(val) {
                    val.selected = !val.selected;
                });
            };
        });
});
