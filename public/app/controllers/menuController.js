(function() {

	var MenuController = function ($scope, $cookieStore, webServiceFactory, $location) {

		$scope.logout = function() {

			var jwt = $cookieStore.get('jwt');

			webServiceFactory.logOut(jwt).then(function(response) {
				$cookieStore.remove('userEmail');
				$cookieStore.remove('userPassword');
                $cookieStore.remove('jwt');

                firebase.auth().signOut().then(function() {
                	$cookieStore.remove('firebaseToken');
                }, function(error) {
                	// An error happened.
                });

                $location.path('/');
                alert('Successful logout. See you again!');
            }, function(data, status, headers, config) {
            	alert('Error ' + status);
            });
		}

	}

	MenuController.$inject = ['$scope', '$cookieStore', 'webServiceFactory', '$location'];

	angular.module('tanandApp').controller('MenuController',  MenuController);

}());