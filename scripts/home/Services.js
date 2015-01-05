var homeservices = angular.module('home.services', []);

homeservices.factory("RequestService", ['$resource', function ($resource) {
        url = 'http://ing-sis.jairoesc.com/vehicle?auth-token=eyJpdiI6IlVFajh0a1ArNnhMVWJSZWdFTmxmNUE9PSIsInZhbHVlIjoibEJ0WmMrZlRIMDUzMWpxQjFGOUtxNFlHUEFaWGNtY0Q1RnhObGhIaUh1WT0iLCJtYWMiOiJmNWMxNzcxZWZlZGNhOTU4YWE0NTU5ZjI1NmE0ODM2OTk2ZDhhODRjNDcyNzRmODAxMTc3ZDcxNTlmOWQ0ZDMxIn0=';
        return $resource(url, {}, {get: {method: "GET", isArray: false}});
    }]);