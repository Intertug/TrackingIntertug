var homeservices = angular.module('home.services', []);
homeservices.factory("getVesselsPosition", ['$resource', '$http', function ($resource, $http) {
        //url = 'http://ing-sis.jairoesc.com/vehicle?auth-token=eyJpdiI6IlVFajh0a1ArNnhMVWJSZWdFTmxmNUE9PSIsInZhbHVlIjoibEJ0WmMrZlRIMDUzMWpxQjFGOUtxNFlHUEFaWGNtY0Q1RnhObGhIaUh1WT0iLCJtYWMiOiJmNWMxNzcxZWZlZGNhOTU4YWE0NTU5ZjI1NmE0ODM2OTk2ZDhhODRjNDcyNzRmODAxMTc3ZDcxNTlmOWQ0ZDMxIn0=';
        return {
            get: function (url) {
                var promise = $http({
                    url: url,
                    data: {GetData: '', SessionID: ''},
                    method: 'POST',
                    headers: {
                        //'Content-Type': 'application/json'
                        //'SOAPAction': 'http://com.intertug.sio/GetVesselsPosition'
                    }
                }).then(function (response) {
                    return response.data;
                });
                return promise;
            }
        };
        //return $resource(url, {}, {get: {method: "GET", isArray: false}});
    }]);