(function() { 

    var FloorplanController = function($scope, firebaseFactory) {

        var sites = [];
        var metadata;
        var file;
        var storageRef = firebase.storage().ref();

        var sitesLoaded = firebase.database().ref('locationList');
        sitesLoaded.on('value', function(snapshot) {
			while(sites.length > 0) {
					sites.pop();
			}
            snapshot.forEach(function(siteKey) {
                sites.push({
                    ID : siteKey.key,
                    name: siteKey.val().name
                });
            });
            $scope.$apply();
            console.log('This is: ' + JSON.stringify(sites));

        }, function() {
            // alert('No site(s) available at the moment.');
        });

        $scope.site = {
            site : null,
            availableOptions: sites
        };

        document.getElementById('file').addEventListener('change', handleFileSelect, false);

        

        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            file = evt.target.files[0];
            console.log(file);
            metadata = {
                'contentType': file.type
            };
            // console.log(metadata);
        }

        console.log(file);

        $scope.updateBuildingSelect = function(value) {
            var buildings = [];
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
                console.log('This is: ' + JSON.stringify(buildings));
            }, function(e) {
                // alert('No building(s) available at the moment.');
            });

            $scope.building = {
                site: null,
                availableOptions: buildings
            };
        }

        $scope.loadFile = function ($input) {
            if ($input.files && $input.files[0]) {
                var reader = new FileReader();

                console.log(reader);

                reader.onload = function (e) {
                    $('#blah')
                    .attr('src', e.target.result)
                    .width(300)
                    .height(180);
                };

                reader.readAsDataURL($input.files[0]);
            }
        };

        $scope.reset = function() {
            document.getElementById('blah').src = "";
        };

        $scope.onFloorplanCreate = function() {
			$scope.loading= true;
            var floorObj = $scope.form;

            var siteKey = floorObj.site;
            var buildKey = floorObj.building;
            var floorId = floorObj.floorplanid;
            var floorName = floorObj.floorplanname;
            var floorUrl;

            storageRef.child(siteKey + '/' + buildKey + '/' + floorName + '/' + file.name).put(file, metadata).then(function(snapshot) {
                floorUrl = snapshot.metadata.downloadURLs[0];
                console.log('File available at', floorUrl);
                firebaseFactory.setFloorplan(siteKey, buildKey, floorName, floorUrl).then(function() {
					$scope.loading= false;
					$scope.$apply();
                    alert("Success added floorplan!");
                    $scope.form = "";
                }, function(e) {
					$scope.loading= false;
					$scope.$apply();
                    // alert('This function cannot be performed at the moment!');
                });
            }).catch(function(error) {
				$scope.loading= false;
				$scope.$apply();
                console.error('Upload failed:', error);
            });

        }
    }

    FloorplanController.$inject = ['$scope', 'firebaseFactory'];

    angular.module('tanandApp').controller('FloorplanController', FloorplanController);

}());