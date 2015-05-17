define([
      'underscore'
    , '../auth'
], function(
      _
    , mod
) {
    return mod
    /** Automatyczne dodawanie zaznaczonego checkboxa do listy */
    .directive('appPermission', function($state, $rootScope, Permission, UserEvents) {
        var link = function(scope, elem, attr) {
            /** 
             * Jeśli brak sprecyzowanego warunku dostępu
             * to bierze z ui-srefa
             */
            if(_.isUndefined(scope.data)) {
                if(!'uiSref' in attr)
                    throw new Error('Unknown permission!');
                scope.data = $state.get(
                    /(\w*)(\.|$)/.exec(attr['uiSref'])[1]).data;
            }

            /** Sprawdzanie */
            var checkPermission = function() {
                elem.toggleClass('ng-hide', !Permission.check(scope.data));
            };

            /** Czekanie na zalogowanie */
            $rootScope.$on(UserEvents.loginChange, function() {
                checkPermission();
            });
            checkPermission();
        };
        return (
            { restrict: 'A'
            , link: link
            , scope: 
                { data: '=?appPermission'
                }
            }
        );
    });
});
