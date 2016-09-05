(function() {
    
    var RegisterController = function($scope, webServiceFactory) {
        
        $scope.onCreateUser = function() {
            
            webServiceFactory.createUser($scope.form).then(function(response) {
                alert('Successfully registered!');
            }, function(data, status, headers, config) {
                alert("Error " + status);
            });
            
        }
        
    }
    
    RegisterController.$inject = ['$scope', 'webServiceFactory'];
    
    angular.module('tanandApp').controller('RegisterController', RegisterController);
    
}());