(function() {

    var RegisterController = function($scope, webServiceFactory) {

        $scope.onCreateUser = function() {
            $scope.loading= true;
            webServiceFactory.createUser($scope.form).then(function(response) {
                $scope.loading= false;
                $scope.$apply();
                alert('Successfully registered!');
            }, function(data, status, headers, config) {
                alert("Error " + status);
                $scope.loading= false;
                $scope.$apply();
                alert("Error " + status);
            });

        }

    }

    RegisterController.$inject = ['$scope', 'webServiceFactory'];

    angular.module('tanandApp').controller('RegisterController', RegisterController);

}());