define([
    '../auth'
], function(
    mod
) {
    return mod
    /** Automatyczne dodawanie checkboxa do listy */
    .directive('appPermission', function(Permission) {
        var link = function(scope, elem, attr) {
            if(!Permission.check(scope.data))
                elem.css('display', 'none');
        };
        return (
            { restrict: 'A'
            , link: link
            , scope: 
                { data: '=appPermission'
                }
            }
        );
    });
});