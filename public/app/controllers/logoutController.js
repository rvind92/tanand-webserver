(function() {
    
    var LogoutController = function($scope, $cookieStore, webServiceFactory) {
        
        var userEmail = $cookieStore.get('userEmail');
        var userPassword = $cookieStore.get('userPassword');
        
        var user = {
            email: userEmail,
            password: userPassword
        }
        
        $scope.logout = function() {
            
            console.log('Email: ' + userEmail);
            console.log('Password: ' + userPassword);
            console.log('User: ' + user);
            
            webServiceFactory.logOut(user).then(function(response) {
                //set view to login.html here upon successful logout
                alert('Successful logout. See you again!');
            }, function(data, status, headers, config) {
                alert('Error ' + status);
            });
        }
        
    }
    
    LogoutController.$inject = ['$scope', '$cookieStore', 'webServiceFactory'];
    
    app.module('tanandApp').controller('LogoutController', LogoutController);
    
}());