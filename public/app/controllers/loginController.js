(function() {
    
    var LoginController = function($scope, $cookieStore, webServiceFactory) {
        
        var firebaseToken;
        
        $scope.onSubmit = function() {
            
            webServiceFactory.postCredentials($scope.form).then(function(response) {
                $cookieStore.put('userEmail', $scope.form.email);
                $cookieStore.put('userPassword', $scope.form.password);
                
                console.log($cookieStore.get('userEmail'));
                console.log($cookieStore.get('userPassword'));
                
                console.log($scope.form);
                firebaseToken = response.headers('FirebaseToken');
                console.log('This is the fbToken: ' + firebaseToken);
                
//                if(firebaseToken) {
//                    firebase.auth().signInWithCustomToken(firebaseToken).catch(function(error) {
//                        var errorCode = error.code;
//                        var errorMessage = error.message;
//                    });
//                    $scope.form = '';
//                    //need to add redirect path to site.html upon successful sign-in
//                }
            }, function(data, status, headers, config) {
                alert("Error " + status);
            });
            
        };
          
    }
    
    LoginController.$inject = ['$scope', '$cookieStore', 'webServiceFactory'];
    
    angular.module('tanandApp').controller('LoginController', LoginController);
    
}());