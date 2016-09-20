(function() {

	var HomeController = function($scope, $firebaseObject) {

		var sites = [];
		var buildings = [];
		var floorplans = [];
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var imgs;
        var mSite;
        var mBuilding;
        var mFloorplan;

        var sitesLoaded = firebase.database().ref('locationList');
        sitesLoaded.on('value', function(snapshot) {
        	snapshot.forEach(function(siteKey) {
        		sites.push({
        			ID: siteKey.key,
        			name: siteKey.val().name
        		});
        	});
        	$scope.$apply();
        	console.log('This is: ' + JSON.stringify(sites));

        }, function() {
        	// alert('No site(s) available at the moment.');
        });

        $scope.sitelist = {
        	site : null,
        	availableOptions: sites
        };

        $scope.updateBuildingSelect = function(value) {
        	mSite = _.findWhere(sites, {ID: value});
        	console.log('THIS IS THE SITE NAME: ' + mSite.name);
        	console.log(value + ' has been selected!');
        	var buildingsLoaded = firebase.database().ref('buildingList').child(value);
        	buildingsLoaded.on('value', function(snapshot) {
        		snapshot.forEach(function(buildingKey) {
        			buildings.push({
        				ID: buildingKey.key,
        				name: buildingKey.val().name
        			});
        		});
        		$scope.$apply();
        		console.log('This is selected: ' + JSON.stringify(buildings));

        	}, function(e) {
        		// alert('No building(s) available at the moment.');
        	});

        	$scope.buildinglist = {
        		building: null,
        		availableOptions: buildings
        	};
        }

		$scope.updateFloorplanSelect = function(siteKey, buildingKey) {
			mBuilding = _.findWhere(buildings, {ID: buildingKey});
			console.log('THIS IS THE BUILDING NAME: ' + mBuilding.name);
			console.log(buildingKey + ' has been selected!');
			var floorplansLoaded = firebase.database().ref('buildingList').child(siteKey).child(buildingKey).child('floorplan');
			floorplansLoaded.on('value', function(snapshot) {
				snapshot.forEach(function(floorplanKey) {
					floorplans.push({
						ID: floorplanKey.key,
						name: floorplanKey.val().name
					});
				});
				console.log('This is: ' + JSON.stringify(floorplans));

			}, function(e) {
				// alert('No building(s) available at the moment.');
			});

			$scope.floorplanlist = {
				floorplan: null,
				availableOptions: floorplans
			};
		}

		$scope.floorplanImg = function(siteKey, buildingKey, floorplanKey) {
			mFloorplan = _.findWhere(floorplans, {ID: floorplanKey});
			console.log('THIS IS THE FLOORPLAN NAME: ' + mFloorplan.name);
            var floorplanImg;
            console.log(buildingKey + ' has been selected!');
            var imgLoaded = firebase.database().ref('buildingList').child(siteKey).child(buildingKey).child('floorplan').child(floorplanKey).child('fpImg');
            imgLoaded.on('value', function(snapshot) {
                floorplanImg = snapshot.val();
                console.log('floorplan img: ' + JSON.stringify(floorplanImg));
                imagesload(floorplanImg);
            
            }, function(e) {
                // alert('No building(s) available at the moment.');
            });

            $scope.location = mSite.name;
            $scope.building = mBuilding.name;
            $scope.floorplan = mFloorplan.name;

            var sample = firebase.database().ref('pm25sensor').child('iskl').child('mac');
            $scope.airquality = $firebaseObject(sample);
        
        };

		function imagesload(floorPlanURL) {
            var img = new Image();
            imgs = img;
            img.onload = function() { 
                $scope.imgHeight = img.height;
                $scope.imgWidth = img.width;
                canvas.width = ($scope.imgWidth) / 2;
                canvas.height = ($scope.imgHeight) / 2;
                console.log("Canvas width: " + canvas.width);
                console.log("Canvas height: " + canvas.height);
                context.clearRect(0,0,600,400);
                context.drawImage(imgs,0,0, canvas.width, canvas.height);
                console.log("This is image Height: " + $scope.imgHeight);
                console.log("This is image Width: " + $scope.imgWidth);
            };
            img.onerror = function(){alert("image load failed");} 
            img.src = floorPlanURL;
            $scope.hidecoor = true;
            $scope.displaydata = true;
        }

	}

	HomeController.$inject = ['$scope', '$firebaseObject'];

	angular.module('tanandApp').controller('HomeController', HomeController);

}());