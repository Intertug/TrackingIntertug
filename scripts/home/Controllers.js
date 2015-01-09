var homecontrollers = angular.module('home.controllers', ['ngResource']);

homecontrollers.controller('HomeController',
        ['$scope', 'uiGmapGoogleMapApi', '$log', 'getVesselsPosition', 'uiGmapIsReady',
            function ($scope, uiGmapGoogleMapApi, $log, getVesselsPosition, uiGmapIsReady) {
                
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
                            scrollwheel: true,
                            streetViewControl: false,
                            scaleControl: true,
                            mapTypeId: google.maps.MapTypeId.TERRAIN,
                                    mapTypeControlOptions:{
                                      position: google.maps.ControlPosition.RIGHT_TOP
                                    },
                            zoomControlOptions: {
                              position: google.maps.ControlPosition.RIGHT_CENTER
                            },
                            panControlOptions: {
                              position: google.maps.ControlPosition.RIGHT_CENTER
                            },
                        };
                        /*markerEvents: Agregamos los eventos de mouseover para mostrar
                         * el info window y de mouseout para hacer que desaparezca. */
                        $scope.map.markerEvents = {
                            mouseover: function (gMarker, eventName, model, latLngArgs) {
                                model.show = true;
                            },
                            mouseout: function (gMarker, eventName, model, latLngArgs) {
                                model.show = false;
                            }
                        };
                        var markers = [];
/*                      Creamos los marcadores que se van a agregar al mapa,
                        agregandole la latitud, longitud, id y title. Además de la información
                        que se mostrará de ellos
*/
                        for (i = 0; i < $scope.vessels.length; i++) {
                            var ret = {
                                latitude: $scope.vessels[i].lat,
                                longitude: $scope.vessels[i].long,
                                title: $scope.vessels[i].vesselname,
                                speed: $scope.vessels[i].speed,
                                gpsdate: $scope.vessels[i].gpsdate,
                                id: $scope.vessels[i].id,
                                icon: 'imgs/ship.png',
                                show: false
                            };
                            markers.push(ret);
                        }
                        $scope.randomMarkers = markers;
                        $scope.ClusterMarkersOptions = {};
                        $scope.ClusterMarkersOptions.gridSize = 60;
                    });
                };
                $scope.getVessels = function () {
                    /* Obtenemos los vessels desde el servidor mediante una peticion http
                     * que se realiza desde el servicio getVesselsPosition. Se obtiene un JSON
                     * que se convierte en objeto. Luego de eso llamamos a la funcion de
                     * inicializar el mapa para que al cargarlo, ya todos los markers de vessels
                     * tengan la información que se trae del servidor. */
                    var url = 'http://190.242.119.122:82/sioservices/daqonboardservice.asmx/GetVesselsPosition';
                    getVesselsPosition.get(url).then(
                            function (data) {
                                var json = $.parseJSON(data.d);
                                $scope.vessels = json.vessels.vessel;
                                $scope.initializeMap();
                            },
                            function (error) {
                                console.log(error.data);
                                $scope.error = error;
                            }
                    );
                };
                $scope.getVessels();
            }]);