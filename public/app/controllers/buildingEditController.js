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
        	}, function(e) {
        		console.log(e);
        	});
        }

        $scope.onBuildingEdit = function() {

        	var buildObj = $scope.form;

			console.log(JSON.stringify(buildObj));

			var siteKey = buildObj.site;
			var buildKey = buildObj.buildingid;
			var buildName = buildObj.buildingname;

			firebaseFactory.updateBuilding(siteKey, buildKey, buildName).then(function() {
				alert('');
			}, function(e) {
				alert('Error ' + e);
			});

			$scope.form = '';

        }

        $scope.onBuildingDelete = function() {

        }

	}

	BuildingEditController.$inject = ['$scope', 'firebaseFactory'];
	
	angular.module('tanandApp').controller('BuildingEditController', BuildingEditController);

}());