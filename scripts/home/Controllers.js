var homecontrollers = angular.module('home.controllers', ['ngResource']);

homecontrollers.controller('HomeController',
        ['$scope', 'uiGmapGoogleMapApi', '$log', function ($scope, uiGmapGoogleMapApi, $log) {
                // uiGmapGoogleMapApi is a promise.
                // The "then" callback function provides the google.maps object.
                uiGmapGoogleMapApi.then(function (maps) {
                    $scope.map = {
                        center: {
                            latitude: 40.1451,
                            longitude: -99.6680
                        },
                        zoom: 4
                    };
                    $scope.options = {
                        scrollwheel: false
                    };
                    var markers = [];
                    var tugs = [
                        ["BaruPacifico", -3.58931333333, -80.746989, 4],
                        ["Mistral", -3.58368333333, -80.7329345, 4],
                        ["Vali", -3.50912833333, -80.660905, 4],
                        ["BaruInti", -5.070405, -81.1084553333, 4],
                        ["Boreas", 10.0004283333, -83.0791666667, 1],
                        ["EosII", 10.3993143333, -75.5239095, 2],
                        ["Alisios", 3.89337616667, -77.0774251667, 3],
                        ["Capidahl", 9.48654383333, -75.7759115, 4],
                        ["Saga", 10.4067566667, -75.5408853333, 4],
                        ["Titania", 10.9744588333, -74.7546875, 4],
                        ["Chinook", 11.084963, -74.2497558333, 4],
                        ["Sirocco", 10.4049051667, -75.532373, 4],
                        ["Aquavit", 9.48603316667, -75.774528, 4],
                        ["Carex", 9.48936966667, -75.7729736667, 4],
                        ["Tanok", 18.43208, -93.1872396667, 4],
                        ["Seatrout", 18.4311401667, -93.2091633333, 4],
                        ["Kin", 18.4321655, -93.187028, 4]
                    ];
                    for (i = 0; i < tugs.length; i++) {
                        var ret = {
                            latitude: tugs[i][1],
                            longitude: tugs[i][2],
                            title: 'm' + tugs[i][0],
                            id: i + 1,
                            icon: '/TrackingIntertug/imgs/ship.png'
                        };
                        markers.push(ret);
                    }
                    $scope.randomMarkers = markers;
                    $scope.ClusterMarkersOptions = {};
                    //$scope.ClusterMarkersOptions.averageCenter = {latitude: 40.1451,longitude: -99.6680}
                    $scope.ClusterMarkersOptions.gridSize = 60;
                });
            }]);

homecontrollers.controller('PeticionController', ['$scope', 'RequestService', '$http', function ($scope, RequestService, $http) {
        $scope.data = RequestService.get();
    }]);
/*var tugs = [
 ];
 */