angular.module('uiGmapgoogle-maps').config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBEuaoh_rW9edjj3Ona1XpY2yOk090mJ5o',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

var app = angular.module('app', ['uiGmapgoogle-maps']);

app.controller('HomeController', ['$scope', 'uiGmapGoogleMapApi', function($scope, uiGmapGoogleMapApi) {
	$scope.markers = [];
    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
    	$scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
    });
}]);