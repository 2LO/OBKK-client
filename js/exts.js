define([
    'underscore'
], function(
    _
) {
    /** Wyłączenie globalnych nazw */
    _.noConflict(true);

    /** Tworzenie łańcucha */
    var fluent = function(assoc) {
        return _(assoc).each(function(val, key) {
            assoc[key] = function() {
                val.apply(arguments.callee.caller, arguments);
                return assoc;
            };
        });
    };
    _.mixin({
        fluent: fluent
    });
});
