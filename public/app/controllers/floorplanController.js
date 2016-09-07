(function() {
    
    var FloorplanController = function($scope, firebaseFactory) {

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

        $scope.site = {
            site : null,
            availableOptions: sites
        };

        $scope.updateBuildingSelect = function(value) {
            var buildings = [];
             console.log(value + ' has been selected!');
             var buildingsLoaded = firebase.database().ref('buildingList').child(value);
             buildingsLoaded.on('value', function(snapshot) {
                 snapshot.forEach(function(buildingKey) {
                     buildings.push({
                         name: buildingKey.key
                     });
                 });
                 $scope.$apply();
                 console.log('This is: ' + JSON.stringify(buildings));
             }, function(e) {
                 alert('No building(s) available at the moment.');
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
        
        $scope.reset = function(){
            document.getElementById('blah').src = "";
        };

        // $scope.onFloorplanCreate = function() {

        //     var floorObj = $scope.form;

        //     var siteKey = floorObj.site;
        //     var buildKey = floorObj.building;
        //     var floorId = floorObj.floorplanid;
        //     var floorName = floorObj.floorplanname;
        //     var floorUrl;

        //     firebaseFactory.setFloorplan(siteKey, buildKey, floorid, floorname, floorUrl).then(function() {
        //         alert(floorname + ' successfully added!');
        //     }, function(e) {
        //         alert('This function cannot be performed at the moment!');
        //     });

        // }

    }

    FloorplanController.$inject = ['$scope', 'firebaseFactory'];
    
    angular.module('tanandApp').controller('FloorplanController', FloorplanController);
    
}());