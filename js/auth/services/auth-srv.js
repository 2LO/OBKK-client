define([
    '../auth'
], function(
    mod
) {
    return mod
    /** 
     * Kody błędów zwracane tylko w JSON
     * Do każdego zapytania dołączony jest token
     */
    .factory('authInterceptor', function () {
        return {
            request: function (config) {
                config.headers.Accept = 'application/json, text/javascript';
                return config;
            }
        };
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });
});