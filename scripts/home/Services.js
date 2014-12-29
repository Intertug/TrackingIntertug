var homeservices = angular.module('home.services', []);

homeservices.factory('request', function($rootScope){
	$http.get('/TrackingIntertug/views/parts.xml').success(function (data, status, headers, config) {
        return {
		    all: function() {
		      return data;
		    }
		 };
    }).error(function(data,status, headers, config){
    	return {
		    all: function() {
		      return status;
		    }
		 };
    });
});