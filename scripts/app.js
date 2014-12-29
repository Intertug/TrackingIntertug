angular.module('uiGmapgoogle-maps').config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBEuaoh_rW9edjj3Ona1XpY2yOk090mJ5o',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

var app = angular.module('app', ['uiGmapgoogle-maps', 'home']);