(function() {
	
	var BuildingController = function($scope, firebaseFactory) {

		var sites = [];

		var sitesLoaded = firebase.database().ref('locationList/');
		sitesLoaded.on('value', function(snapshot) {
			snapshot.forEach(function(siteKey) {
				sites.push({
					name: siteKey.key
				});
			});
            $scope.$apply();
			console.log('This is: ' + JSON.stringify(sites));

		}, function() {
			alert('No site(s) available at the moment.');
		});

		$scope.building = {
			site : null,
			availableOptions: sites
		};
        

		$scope.onBuildingCreate = function() {

			var buildObj = $scope.form;

			console.log(JSON.stringify(buildObj));

			var siteKey = buildObj.site;
			var buildKey = buildObj.buildingid;
			var buildName = buildObj.buildingname;

			firebaseFactory.setBuilding(siteKey, buildKey, buildName).then(function() {
				alert(buildName + ' successfully added!');
			}, function(e) {
				alert('This function cannot be performed at the moment!');
			});

			$scope.form = '';
		}

	}

	BuildingController.$inject = ['$scope', 'firebaseFactory'];
	
	angular.module('tanandApp').controller('BuildingController', BuildingController);
	
}());