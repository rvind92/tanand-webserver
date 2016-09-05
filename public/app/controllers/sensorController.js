(function() {
    
    var SensorController = function ($scope, firebaseFactory) {

    	$scope.showCoords = function () {
            $scope.x = event.offsetX;
            $scope.y = event.offsetY;
            $scope.coor = "X coords: " + this.x + ", Y coords: " + this.y;
        };

    }

    SensorController.$inject = ['$scope', 'firebaseFactory'];
    
    angular.module('tanandApp').controller('SensorController', SensorController);
    
}());