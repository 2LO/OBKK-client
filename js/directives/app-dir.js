define([
    '../app'
], function(
    mod
) {
    return mod
    /** Automatyczne dodawanie zaznaczonego checkboxa do listy */
    .directive('ngCheckboxList', function() {
        var link = function(scope, elem, attr) {
            var modify = function() {
                if(elem[0].checked) {
                    if(!_.contains(scope.list, scope.value))
                        scope.list.push(scope.value);
                } else {
                    scope.list = _.without( scope.list
                                          , _.findWhere(scope.list, scope.value));
                }
            };
            elem.bind('change', function() {
                scope.$apply(modify);
            });
        };
        return (
            { restrict: 'A'
            , link: link
            , scope: 
                { list: '=ngCheckboxList' 
                , value: '=ngCheckboxValue' 
                }
            }
        );
    })
    .directive('ngActive', function() {
        return (
            { restrict: 'A'
            , link: function(scope, elem, attr) {
            }
            , scope: 
                { data: '=?&ngActive'
                }
            }
        );
    })
    /** Automatyczne dodawanie checkboxa do listy */
    .filter('range', function() {
        return function(val, range) {
            return _.range(0, parseInt(range));
        }
    });
});