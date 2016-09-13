(function() {

	var BuildingEditController= function($scope, firebaseFactory) {

		var sites = [];
		var temp = '';

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

		$scope.site = {
			site : null,
			availableOptions: sites
		};

		$scope.updateBuildingSelect = function(value) {
            var buildings = [];
            temp = value;
            console.log('TEMP VALUE: ' + temp);
            console.log(value + ' has been selected!');
            var buildingsLoaded = firebase.database().ref('buildingList').child(temp);
            buildingsLoaded.on('value', function(snapshot) {
                snapshot.forEach(function(buildingKey) {
                    buildings.push({
                        name: buildingKey.key
                    });
                });
                console.log('This is: ' + JSON.stringify(buildings));
            }, function(e) {
                alert('No building(s) available at the moment.');
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
                $scope.buildingInfo = "Current building info " +  "\nName: " + snapshot.val().name + "\nID: " + value + "\nSite: " + temp;
        	}, function(e) {
        		console.log(e);
        	});
        }

        $scope.onBuildingEdit = function() {

        	var buildObj = $scope.form;

			console.log('PRINT THE OBJECT: ' + JSON.stringify(buildObj));

			var siteKey = buildObj.site;
			var buildKey = buildObj.building;
			var buildName = buildObj.buildingname;

            console.log('THIS IS SITE: ' + siteKey);
            console.log('THIS IS BUILD: ' + buildKey);
            console.log('THIS IS BUILDNAME: ' + buildName);

			firebaseFactory.updateBuilding(siteKey, buildKey, buildName).then(function() {
				alert('Building successfully updated!');
			}, function(e) {
				alert('Error ' + e);
			});

			$scope.form = '';

        }

        $scope.onBuildingDelete = function() {

            var buildObj = $scope.form;

            console.log('PRINT THE OBJECT: ' + JSON.stringify(buildObj));

            var siteKey = buildObj.site;
            var buildKey = buildObj.building;
            var buildName = buildObj.buildingname;

            console.log('THIS IS SITE: ' + siteKey);
            console.log('THIS IS BUILD: ' + buildKey);
            console.log('THIS IS BUILDNAME: ' + buildName);

            firebaseFactory.deleteBuilding(siteKey, buildKey).then(function() {
                alert('Building successfully deleted!');
            }, function(e) {
                alert('Error ' + e);
            });

            $scope.form = '';

        }

	}

	BuildingEditController.$inject = ['$scope', 'firebaseFactory'];
	
	angular.module('tanandApp').controller('BuildingEditController', BuildingEditController);

}());