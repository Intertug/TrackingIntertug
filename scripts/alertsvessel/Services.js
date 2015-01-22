var services = angular.module("alertsvessel.services", []);

services.factory("getVesselsInfo", ['$http', function ($http) {
        /* Este servicio realiza una peticion al servidor, que obtiene los vessels
         * con su posicion, velocidad, fecha de posicion.*/
        return {
            get: function (url) {
                var promise = $http({
                    url: url,
                    data: {GetData: '', SessionID: ''},
                    method: 'POST'
                }).then(function (response) {
                    return response.data;
                });
                return promise;
            }
        };
    }]);