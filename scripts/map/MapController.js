var initializemap = angular.module('InitializeMap', []);

initializemap.controller('MapController',
        ['$scope', 'uiGmapGoogleMapApi', 'VesselsRequest', '$interval',
            function ($scope, uiGmapGoogleMapApi, VesselsRequest, $interval) {

                //Declaramos map y vessels antes para evitar erroers 'undefined'
                $scope.map = {}, $scope.Markers = {}, $scope.vessels = {};
                var markers = [];

                $scope.getVessels = function () {
                    /*Obtenemos los vessels del servidor, y luego de eso creamos
                     * los markers y sus eventos. */
                    VesselsRequest.post().then(function (vessels) {
                        $scope.createMarkers(vessels);
                        $scope.createEventsMarkers();
                    });
                };

                $scope.initializeMap = function () {
                    //Inicializa el Mapa de Google
                    uiGmapGoogleMapApi.then(function (maps) {
                        $scope.map = {
                            center: {//Centro por defeault al cargar
                                latitude: 9.024365,
                                longitude: -72.913396
                            },
                            zoom: 4 //Zoom por default al cargar
                        };
                        $scope.options = {
                            scrollwheel: true //Mostrar la barra de zoom y boton de movimiento
                        };
                    });
                };

                $scope.createMarkers = function (vessels) {
                    /* Creamos los marcadores que se van a agregar al mapa,
                     agregandole la latitud, longitud, id y title. Además de la información
                     que se mostrará de ellos */
                    for (i = 0; i < vessels.length; i++) {
                        var vessel = {
                            latitude: vessels[i].lat,
                            longitude: vessels[i].long,
                            title: vessels[i].vesselname,
                            speed: vessels[i].speed,
                            gpsdate: vessels[i].gpsdate,
                            id: vessels[i].id,
                            icon: 'imgs/ship.png',
                            show: false
                        };
                        markers[i] = vessel;
                    }
                    $scope.Markers = markers;
                    $scope.ClusterMarkersOptions = {};
                    $scope.ClusterMarkersOptions.gridSize = 60;
                };

                $scope.createEventsMarkers = function () {
                    /* Creamos los eventos para que aparezca el infowindow al
                     * pasar el mouse por encima del marker (vessel) y que
                     * desaparezca cuando le quitamos el mouse de encima. */
                    $scope.map.markerEvents = {
                        mouseover: function (gMarker, eventName, model, latLngArgs) {
                            model.show = true;
                        },
                        mouseout: function (gMarker, eventName, model, latLngArgs) {
                            model.show = false;
                        }
                    };
                };

                $scope.initializeMap();
                $scope.getVessels();
                var minuto = 60000;
                $interval($scope.getVessels, minuto);
            }]);
