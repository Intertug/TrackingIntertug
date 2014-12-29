angular.module('uiGmapgoogle-maps').config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBEuaoh_rW9edjj3Ona1XpY2yOk090mJ5o',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

var app = angular.module('app', ['uiGmapgoogle-maps', 'home', 'ngRoute']);

app.config(function($routeProvider, $locationProvider){
    $routeProvider.when("/", {
        templateUrl : "/TrackingIntertug/index.html",
        controller : "HomeController"
    })
    .when('/vesselinfo', {
    	templateUrl: "/TrackingIntertug/views/shipinfo.html"
    })
    .otherwise({ reditrectTo : "/TrackingIntertug/views/shipinfo.html" });

    $locationProvider.html5Mode(true).hashPrefix('!');
});