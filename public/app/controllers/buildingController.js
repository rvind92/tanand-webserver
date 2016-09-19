(function() {
	
	var BuildingController = function($scope, firebaseFactory,$q) {

		var sites = [];
		var sitesLoaded = firebase.database().ref('locationList');
		sitesLoaded.on('value', function(snapshot) {
			snapshot.forEach(function(siteKey) {
				while(sites.length > 0) {
					sites.pop();
				}
				sites.push({
					name: siteKey.val().name,
                    ID : siteKey.key
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
			$scope.loading= true;
			var buildObj = $scope.form;

			console.log(JSON.stringify(buildObj));

			var siteKey = buildObj.site;
			var buildName = buildObj.buildingname;
            
            console.log('SITE KEY: ' + siteKey);
            console.log('BUILD NAME: ' + buildName);
	 $q.when(true);
			
			firebaseFactory.setBuilding(siteKey, buildName).then(function() {
				console.log(siteKey+' this is success')
				$scope.loading= false;
				$scope.$apply();
				alert("Building successfully add!");
			}, function(e) {
				$scope.loading= false;
				$scope.$apply();
				alert('This function cannot be performed at the moment!');
			});

			$scope.form = '';
		}
		

	}

	BuildingController.$inject = ['$scope', 'firebaseFactory','$q'];
	
	angular.module('tanandApp').controller('BuildingController', BuildingController);
	
}());