(function() {
    
    var LoginController = function($scope, $cookieStore, $location ,webServiceFactory) {
        
        var firebaseToken;
        var jwt;
        
        $scope.onLogin = function() {
            
            webServiceFactory.postCredentials($scope.form).then(function(response) {
                $cookieStore.put('userEmail', $scope.form.email);
                $cookieStore.put('userPassword', $scope.form.password);
                
                console.log($cookieStore.get('userEmail'));
                console.log($cookieStore.get('userPassword'));
                
                console.log($scope.form);
                jwt = response.headers('Auth');
                firebaseToken = response.headers('FirebaseToken');

                $cookieStore.put('jwt', jwt);
                $cookieStore.put('firebaseToken', firebaseToken);
              
                if(firebaseToken) {
                    firebase.auth().signInWithCustomToken(firebaseToken).catch(function(error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log('CODE: ' + errorCode + ' ' + 'MESSAGE: ' + errorMessage);
                    });
                    $scope.form = '';
                    $location.path('/site');
                }
            }, function(data, status, headers, config) {
                alert("Error " + status);
            });
            
        };
          
    }
    
    LoginController.$inject = ['$scope', '$cookieStore', '$location','webServiceFactory'];
    
    angular.module('tanandApp').controller('LoginController', LoginController);
    
}());