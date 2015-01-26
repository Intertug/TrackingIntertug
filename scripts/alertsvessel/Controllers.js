var alertcontrollers = angular.module('alertsvessel.controllers', []);

alertcontrollers.controller('AlertsController', ['$scope', 'VesselsRequest', '$interval',
    function ($scope, VesselsRequest, $interval) {

        var dosminuto = 120000;
        $scope.vessels = {};

        $scope.getVessels = function () {
            VesselsRequest.post().then(function (vessels) {
                $scope.vessels = vessels;
            });
        };

        $scope.norpm = function (rpm) {
            if (typeof (rpm) !== 'undefined')
                return false;
            else
                return true;
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
            } else if ((parseInt(actual.getHours()) - parseInt(fecha.getHours())) == 1) {
                if ((parseInt(actual.getMinutes()) + (60 - parseInt(fecha.getMinutes()))) > 59) {
                    return true;
                }
            } else {
                return false;
            }
        };

        $scope.alertavelocidad = function (vessel) {
            if (vessel.id == 5) {
                if (parseFloat(vessel.speed) > 8)
                    return true;
            } else {
                if (parseFloat(vessel.speed) > 9)
                    return true;
            }
            return false;
        };
        $scope.getVessels();
        $interval($scope.getVessels, dosminuto);
    }]);