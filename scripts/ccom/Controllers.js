var ccomcontrollers = angular.module('ccom.controllers', []);

ccomcontrollers.controller('CcomController', ['$scope', 'uiGmapGoogleMapApi', function ($scope, uiGmapGoogleMapApi) {
        $scope.initializeMap = function () {
//Creamos el mapa, e insertamos los marcadores y los infowindows.
            uiGmapGoogleMapApi.then(function (maps) {
                $scope.map = {
                    center: {
                        latitude: 9.024365,
                        longitude: -72.913396
                    },
                    zoom: 4
                };
                $scope.options = {
                    scrollwheel: true
                };
                $scope.polylines = [
                    {
                        id: 1,
                        path: [
                            {
                                latitude: 45,
                                longitude: -74
                            },
                            {
                                latitude: 30,
                                longitude: -89
                            },
                            {
                                latitude: 37,
                                longitude: -122
                            },
                            {
                                latitude: 60,
                                longitude: -95
                            }
                        ],
                        stroke: {
                            color: '#6060FB',
                            weight: 3
                        },
                        editable: false,
                        draggable: false,
                        geodesic: true,
                        visible: true,
                        icons: [{
                                icon: {
                                    path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
                                },
                                offset: '25px',
                                repeat: '50px'
                            }]
                    },
                    {
                        id: 2,
                        path: [
                            {
                                latitude: 47,
                                longitude: -74
                            },
                            {
                                latitude: 32,
                                longitude: -89
                            },
                            {
                                latitude: 39,
                                longitude: -122
                            },
                            {
                                latitude: 62,
                                longitude: -95
                            }
                        ],
                        stroke: {
                            color: '#6060FB',
                            weight: 3
                        },
                        editable: false,
                        draggable: false,
                        geodesic: true,
                        visible: true,
                        icons: [{
                                icon: {
                                    path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
                                },
                                offset: '25px',
                                repeat: '50px'
                            }]
                    }
                ];
                var ret = {
                    coords: {
                        latitude: 37,
                        longitude: -122
                    },
                    title: "prueba",
                    id: 1,
                    icon: 'imgs/ship.png',
                };
                $scope.optionsm = {
                    visible: true,
                };
                $scope.marker = ret;
            });
        };

        $scope.initializeMap();
    }]);