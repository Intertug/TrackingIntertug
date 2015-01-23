var request = angular.module('request', []);

request.factory("VesselsRequest", ['$http', '$q', function ($http, $q) {
        return {
            post: function () {
                var promise = $http({
                    url: "http://190.242.119.122:82/sioservices/daqonboardservice.asmx/GetVesselsPosition",
                    data: {SessionID: '', GetData: ''},
                    method: 'POST'
                }).then(function (response) {
                    var json = $.parseJSON(response.data.d);
                    return json.vessels.vessel;
                }, function (response) {
                    console.log(response);
                    return $q.reject(response.data);
                });
                return promise;
            }
        };
    }]);