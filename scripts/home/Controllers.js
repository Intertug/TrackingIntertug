var homecontrollers = angular.module('home.controllers', []);

homecontrollers.controller('HomeController',
	['$scope', 'uiGmapGoogleMapApi', '$log' , function($scope, uiGmapGoogleMapApi, $log){
	$scope.markers = [];
    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
    	$scope.map = {center: {latitude: 10.397100876463162, longitude: -75.47116564868168 }, zoom: 14 };
    	
    	$scope.marker = {
	      id: 0,
	      coords: {latitude: 10.397100876463162, longitude: -75.47116564868168 },
	      options: { draggable: false },
	      icon: '/TrackingIntertug/imgs/ship.png'
	    };
    });
}]);

homecontrollers.controller('PeticionController', ['$scope', '$http', function($scope, $http){
    url= 'http://ing-sis.jairoesc.com/vehicle?auth-token=eyJpdiI6IndTUGNJdFZLN0pKblJ4V0QwVVlzcGc9PSIsInZhbHVlIjoib0FtVmVSWXg4TzMyd2xheDQ2bDdzMGZkME5CQ3kraWEzOE5SN2FiTGtkcz0iLCJtYWMiOiIwNzU1MzAyNmRkZGJmZDRiNzNmZWU1M2ZmZmQzNDAwYjBhNzNmMjQ4ZDA2MTJmMWRhYzIzYzI4ZWFhY2VmNTMzIn0=';
    $http.get(url)
    .success(function (data, status, headers, config) {
		$scope.data=data;
	});
}]);