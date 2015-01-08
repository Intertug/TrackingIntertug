var homecontrollers = angular.module('home.controllers', ['ngResource']);

homecontrollers.controller('HomeController',
        ['$scope', 'uiGmapGoogleMapApi', '$log', 'getVesselsPosition', function ($scope, uiGmapGoogleMapApi, $log, getVesselsPosition) {
                // uiGmapGoogleMapApi is a promise.
                // The "then" callback function provides the google.maps object.

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
                            scrollwheel: false
                        };
                        var markers = [];
                        for (i = 0; i < $scope.vessels.length; i++) {
                            var ret = {
                                latitude: $scope.vessels[i].lat,
                                longitude: $scope.vessels[i].long,
                                title: $scope.vessels[i].vesselname,
                                id: $scope.vessels[i].id,
                                icon: '/TrackingIntertug/imgs/ship.png'
                            };
                            markers.push(ret);
                        }
                        $scope.randomMarkers = markers;
                        $scope.ClusterMarkersOptions = {};
                        $scope.ClusterMarkersOptions.gridSize = 60;
                    });
                };

                $scope.getVessels = function () {
                    url = 'http://190.242.119.122:82/sioservices/daqonboardservice.asmx/GetVesselsPosition';
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