(function() {

	var BuildingEditController= function($scope, firebaseFactory) {

		var sites = [];
		var buildings = [];
		var temp = '';

		var sitesLoaded = firebase.database().ref('locationList');
		sitesLoaded.on('value', function(snapshot) {
			while(sites.length > 0) {
					sites.pop();
				}
			snapshot.forEach(function(siteKey) {
				sites.push({
					name: siteKey.val().name,
                    ID : siteKey.key
				});
			});
            $scope.$apply();
			console.log('This is: ' + JSON.stringify(sites));

		}, function() {
		//	alert('No site(s) available at the moment.');
		});

		$scope.site = {
			site : null,
			availableOptions: sites
		};

		$scope.updateBuildingSelect = function(value) {
            
            temp = value;
            console.log('TEMP VALUE: ' + temp);
            console.log(value + ' has been selected!');
            var buildingsLoaded = firebase.database().ref('buildingList').child(temp);
            buildingsLoaded.on('value', function(snapshot) {
                while(buildings.length > 0) {
                    buildings.pop();
                }
                snapshot.forEach(function(buildingKey) {
                    buildings.push({
                        ID: buildingKey.key,
                        name: buildingKey.val().name
                    });
                });
				$scope.$apply();
                console.log('This is: ' + JSON.stringify(buildings));
            }, function(e) {
				
            });

            $scope.building = {
                site: null,
                availableOptions: buildings
            };
        }

        $scope.onEverySelect = function(value) {
        	var buildingDetails = firebase.database().ref('buildingList').child(temp).child(value);
        	buildingDetails.on('value', function(snapshot) {
        		console.log('THIS IS THE SNAPSHOT VALUE: ' + snapshot.val().name);
                $scope.buildingInfo = "Current building info " +  "\nNAME: " + snapshot.val().name + "\nID: " + value + "\nSITE: " + temp;
        	}, function(e) {
        	//	console.log(e);
        	});
        }

        $scope.onBuildingEdit = function() {
			$scope.loading= true;
        	var buildObj = $scope.form;

			console.log('PRINT THE OBJECT: ' + JSON.stringify(buildObj));

			var siteKey = buildObj.site;
			var buildKey = buildObj.building;
			var buildName = buildObj.buildingname;

            console.log('THIS IS SITE: ' + siteKey);
            console.log('THIS IS BUILD: ' + buildKey);
            console.log('THIS IS BUILDNAME: ' + buildName);
			
			firebaseFactory.updateBuilding(siteKey, buildKey, buildName).then(function() {
                sites = [];
                while(buildings.length > 0) {
                    buildings.pop();
                }
				$scope.loading= false;
				$scope.$apply();
				alert('Building successfully updated!');
			}, function(e) {
				$scope.loading= false;
				$scope.$apply();
				// alert('Error ' + e);
			});
		

			$scope.form = '';
            $scope.buildingInfo = '';

        }

        $scope.onBuildingDelete = function() {
			$scope.loading= true;
            var buildObj = $scope.form;

            console.log('PRINT THE OBJECT: ' + JSON.stringify(buildObj));

            var siteKey = buildObj.site;
            var buildKey = buildObj.building;
            var buildName = buildObj.buildingname;

            console.log('THIS IS SITE: ' + siteKey);
            console.log('THIS IS BUILD: ' + buildKey);
            console.log('THIS IS BUILDNAME: ' + buildName);

            firebaseFactory.deleteBuilding(siteKey, buildKey).then(function() {
				$scope.loading= false;
				$scope.$apply();
                alert('Building successfully deleted!');
            }, function(e) {
				$scope.loading= false;
				$scope.$apply();
                // alert('Error ' + e);
            });

            $scope.form = '';
            $scope.buildingInfo = '';

        }

	}

	BuildingEditController.$inject = ['$scope', 'firebaseFactory'];
	
	angular.module('tanandApp').controller('BuildingEditController', BuildingEditController);

}());