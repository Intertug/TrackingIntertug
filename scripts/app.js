/*  Aqui configuramos la carga asincrona de google maps    */
angular.module('uiGmapgoogle-maps').config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBEuaoh_rW9edjj3Ona1XpY2yOk090mJ5o',
        v: '3.17',
        libraries: 'visualization'
    });
});

/*   Aqui creamos el modulo principal de la aplicación y
 configuramos las rutas. Además, agregamos aquí los controladores
 que pueden ser comunes para toda la aplicación. Por ejemplo, la
 creación del mapa.   */
var app = angular.module('app', ['uiGmapgoogle-maps', 'home', 'ccom', 'alertsvessel', 'ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when("/", {
        redirectTo: '/map'
    }).when('/map', {
        templateUrl: "views/home.html",
        controller: "HomeController"
    }).when('/info', {
        templateUrl: "views/shipinfo.html"
    }).when('/ccom', {
        templateUrl: "views/ccom.html",
        controller: "CcomController"
    }).when('/alerts', {
        templateUrl: "views/alertasvessel.html",
        controller: "AlertsController"
    }).otherwise({reditrectTo: "/map"});
});