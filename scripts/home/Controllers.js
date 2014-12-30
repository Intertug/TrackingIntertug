var homecontrollers = angular.module('home.controllers', ['ngResource']);

homecontrollers.controller('HomeController',
	['$scope', 'uiGmapGoogleMapApi', '$log', function($scope, uiGmapGoogleMapApi, $log){
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

homecontrollers.controller('PeticionController', ['$scope', 'RequestService', '$http', function($scope, RequestService, $http){
    $scope.data = RequestService.get();
}]);