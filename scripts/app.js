/*  Aqui configuramos la carga asincrona de google maps    */
angular.module('uiGmapgoogle-maps').config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBEuaoh_rW9edjj3Ona1XpY2yOk090mJ5o',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

/*   Aqui creamos el modulo principal de la aplicación y
    configuramos las rutas. Además, agregamos aquí los controladores
    que pueden ser comunes para toda la aplicación. Por ejemplo, la
    creación del mapa.   */
var app = angular.module('app', 
    ['uiGmapgoogle-maps', 'home', 'ngRoute']);

app.config(function($routeProvider, $locationProvider){
    $routeProvider.when("/", {
        redirectTo: '/map'
    })
    .when('/map', {
    	templateUrl: "/TrackingIntertug/views/index.html"
    })
    .when('/info', {
        templateUrl: "/TrackingIntertug/views/shipinfo.html"
    })
    .otherwise({ reditrectTo : "/" });

//    $locationProvider.html5Mode(true);//.hashPrefix('!');
});