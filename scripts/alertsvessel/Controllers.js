var alertcontrollers = angular.module('alertsvessel.controllers', []);

alertcontrollers.controller('AlertsController', ['$scope', 'getVesselsInfo', function ($scope, getVesselsInfo) {
        $scope.getVessels = function () {
            var url = 'http://190.242.119.122:82/sioservices/daqonboardservice.asmx/GetVesselsPosition';
            getVesselsInfo.get(url).then(
                    function (data) {
                        var json = $.parseJSON(data.d);
                        $scope.vessels = json.vessels.vessel;
                    },
                    function (error) {
                        $scope.error = error;
                    }
            );
        };
        
        $scope.norpm = function(rpm){
            if(typeof(rpm) != 'undefined'){
                return false;
            }else{
                return true;
            }
        }
        $scope.getVessels();
    }]);