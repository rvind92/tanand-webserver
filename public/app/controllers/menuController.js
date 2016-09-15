(function() {

	var MenuController = function ($scope, $cookieStore, webServiceFactory, $location) {

		$scope.logout = function() {

			var jwt = $cookieStore.get('jwt');
			$cookieStore.put('userAuth', true);

			webServiceFactory.logOut(jwt).then(function(response) {
				$cookieStore.remove('userEmail');
				$cookieStore.remove('userPassword');
                $cookieStore.remove('jwt');
				console.log('SUCCESSFULLY LOGGED OUT FROM ANGULAR APP!');

                firebase.auth().signOut().then(function() {
                	$cookieStore.remove('firebaseToken');
					console.log('SUCCESSFULLY LOGGED OUT FROM FIREBASE!');
					$location.path('/');
					alert('Successful logout. See you again!');
                }, function(error) {
                	// An error happened.
                });
                
            }, function(data, status, headers, config) {
            	alert('Error ' + status);
            });
		}

	}

	MenuController.$inject = ['$scope', '$cookieStore', 'webServiceFactory', '$location'];

	angular.module('tanandApp').controller('MenuController',  MenuController);

}());