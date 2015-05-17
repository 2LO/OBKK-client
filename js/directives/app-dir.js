define([
    '../app'
], function(
    mod
) {
    return mod
    /** Automatyczne dodawanie checkboxa do listy */
    .filter('range', function() {
        return function(val, range) {
            return _.range(0, parseInt(range));
        }
    });
});