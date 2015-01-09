var homecontrollers = angular.module('home.controllers', ['ngResource']);

homecontrollers.controller('HomeController',
        ['$scope', 'uiGmapGoogleMapApi', '$log', 'getVesselsPosition', 'uiGmapIsReady',
            function ($scope, uiGmapGoogleMapApi, $log, getVesselsPosition, uiGmapIsReady) {
                $scope.initializeMap = function () {
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
                        $scope.map.markerEvents = {
                            mouseover: function (gMarker, eventName, model, latLngArgs) {
                                model.show = true;
                            },
                            mouseout: function (gMarker, eventName, model, latLngArgs) {
                                model.show = false;
                            }
                        };
                        var markers = [];
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