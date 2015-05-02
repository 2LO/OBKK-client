define([
    '../auth'
], function(
    mod
) {
    return mod
    /** Automatyczne dodawanie checkboxa do listy */
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
    /** Automatyczne wstawianie znaków pomiędzy */
    .directive('ngPlaceholder', function() {
        var matchPattern = function(pattern, elem, val) {
            if(typeof val === 'undefined')
                return;
            /** Automatyczne przeskakiwanie do szablonu */
            var index = val.length,
                c     = val[index-1];

            /** Kasowanie separatora jeśli jest ostatnim znakiem string */
            if(index != 0 && pattern[index-1] === c)
                val = val.substr(0, index-1);
            /** Kasowanie całego tekstu po wstawieniu znaku w polu cyfry */
            else if(pattern[index] !== 'C' && !/^\d$/.test(c))
                val = '';
            /** Dodawanie separatora z szablonu */
            else if(index < pattern.length && !/^[CD]$/.test(pattern[index]))
                val += pattern[index];
            elem.val(val);
        };

        var link = function(scope, elem, attr) {
            var placeholder = attr.ngPlaceholder;
            elem.attr('placeholder', placeholder);
            scope.$watch( attr.ngModel 
                        , _.bind(matchPattern, this, placeholder, elem));
        };
        return (
            { restrict: 'A'
            , link: link
            }
        );
    });
});