var alertcontrollers = angular.module('alertsvessel.controllers', []);

alertcontrollers.controller('AlertsController', ['$scope', 'getVesselsInfo', '$interval',
    function ($scope, getVesselsInfo, $interval) {
        $scope.getVessels = function () {
            var url = 'http://190.242.119.122:82/sioservices/daqonboardservice.asmx/GetVesselsPosition';
            getVesselsInfo.get(url).then(
                    function (data) {
                        var json = $.parseJSON(data.d);
                        $scope.vessels = json.vessels.vessel;
                        console.log($scope.vessels);
                    },
                    function (error) {
                        $scope.error = error;
                    }
            );
        };

        $scope.norpm = function (rpm) {
            if (typeof (rpm) != 'undefined') {
                return false;
            } else {
                return true;
            }
        };

        $scope.alertafecha = function (date) {
            var fecha = new Date(date);
            var actual = new Date();
            if (fecha.getFullYear() < actual.getFullYear()) {
                return true;
            } else if (fecha.getMonth() < actual.getMonth()) {
                return true;
            } else if (fecha.getDay() < actual.getDay()) {
                return true;
            } else if ((parseInt(actual.getHours()) - parseInt(fecha.getHours())) > 1) {
                return true;
            } else if ((parseInt(actual.getHours()) - parseInt(fecha.getHours())) <= 1) {
                if (parseInt(fecha.getMinutes()) > 58) {
                    return true;
                }
            } else {
                return false;
            }
        };

        $scope.alertavelocidad = function (vessel) {
            if (vessel.vesselname == 'CAREX') {
                if (parseInt(vessel.speed) > 8) {
                    return true;
                }
            } else {
                if (parseInt(vessel.speed) > 9) {
                    return true;
                }
            }
            return false;
        };
        $scope.getVessels();
        var minuto = 120000;
        $interval($scope.getVessels, minuto);
    }]);