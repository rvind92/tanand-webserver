(function() {
    
    var BuildingController = function ($scope, firebaseFactory) {

    	var sitesLoaded = firebase.database().ref('locationList/');
    	sitesLoaded.on('value', function(snapshot) {
    		// $scope.form = {
    		// 	site: {
    		// 		snapshot.val()
    		// 	},
    		// 	buildingid: null,
    		// 	buildingname: null
    		// }
    		snapshot.forEach(function(siteKey) {
    			console.log('This is: ' + siteKey.key);
    		});

    		console.log(JSON.stringify(snapshot.key));
    	}, function() {
    		alert('No site(s) available at the moment.');
    	});

    	// $scope.onBuildingCreate = function() {

    	// 	$scope.form

    	// }

    }

    BuildingController.$inject = ['$scope', 'firebaseFactory'];
    
    angular.module('tanandApp').controller('BuildingController', BuildingController);
    
}());