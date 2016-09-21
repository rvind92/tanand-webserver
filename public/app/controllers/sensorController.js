(function() {
    
    var SensorController = function ($scope, firebaseFactory) {
        
        var sites = [];
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var imgs, imgscale;
        var buildings = [];
        var floorplans = [];

        var sitesLoaded = firebase.database().ref('locationList');
        while(sites.length > 0) {
                    sites.pop();
        }
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
            
            console.log(value + ' has been selected!');
            var buildingsLoaded = firebase.database().ref('buildingList').child(value);
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
                // alert('No building(s) available at the moment.');
            });
        
            $scope.buildinglist = {
               building: null,
               availableOptions: buildings
            };
        }
        
        $scope.updateFloorplanSelect = function(sitekey, buildingkey) {
            
            console.log(buildingkey + ' has been selected!');
            var floorplansLoaded = firebase.database().ref('buildingList').child(sitekey).child(buildingkey).child('floorplan');
            floorplansLoaded.on('value', function(snapshot) {
                while(floorplans.length > 0) {
                    floorplans.pop();
                }
               snapshot.forEach(function(floorplanKey) {
                   floorplans.push({
                       ID: floorplanKey.key,
                       name: floorplanKey.val().name
                   });
               });
//                $scope.$apply();
                console.log('This is: ' + JSON.stringify(floorplans));
            
            }, function(e) {
                // alert('No building(s) available at the moment.');
            });
        
            $scope.floorplanlist = {
               floorplan: null,
               availableOptions: floorplans
            };
        }
            
        $scope.floorplanImg = function(sitekey, buildingkey,floorplanKey) {
            var floorplanImg;
            console.log(buildingkey + ' has been selected!');
            var imgLoaded = firebase.database().ref('buildingList').child(sitekey).child(buildingkey).child('floorplan').child(floorplanKey).child('fpImg');
            imgLoaded.on('value', function(snapshot) {
                floorplanImg = snapshot.val();
                console.log('floorplan img: ' + JSON.stringify(floorplanImg));
                imagesload(floorplanImg);
            
            }, function(e) {
                // alert('No building(s) available at the moment.');
            });
        
        };
        
        $scope.showSubtype = function(){
            $scope.subtype = true;
        };
        
        $scope.handleSelect = function() {
            if (this.value == 't' || this.value == 'p') {
                document.getElementById('subtype').disabled = true;
            } else {
                document.getElementById('subtype').disabled = false;
            }
        };
        
        function imagesload(floorPlanURL) {
            var img = new Image();
            imgs = img;
            img.onload = function() { 
                $scope.imgHeight = img.height;
                $scope.imgWidth = img.width;
                if($scope.imgHeight > 720 && $scope.imgWidth > 1280)
                {
                    imgscale = 3;
                    canvas.width = ($scope.imgWidth) / 3;
                    canvas.height = ($scope.imgHeight) / 3;
                    context.clearRect(0,0,600,400);
                    context.drawImage(imgs,0,0, canvas.width, canvas.height);
                }
                else{
                    imgscale = 2;
                    canvas.width = ($scope.imgWidth) / 2;
                    canvas.height = ($scope.imgHeight) / 2;
                    context.clearRect(0,0,600,400);
                    context.drawImage(imgs,0,0, canvas.width, canvas.height);
                }
//                console.log("This is image Height: " + $scope.imgHeight);
//                console.log("This is image Width: " + $scope.imgWidth);
            };
            img.onerror = function(){alert("image load failed");} 
            img.src = floorPlanURL;
            $scope.hidecoor = true;
            $scope.sensordiv = true;
        }

        $scope.addData = function() {
            $scope.data = {x: $scope.x, y: $scope.y};
            console.log($scope.data);
            $scope.x = '';
            $scope.y = '';
            drawDot($scope.data);
        };

        function drawDot(data) {
            context.beginPath();
            console.log(data);
            context.clearRect(0,0,600,400);
            context.drawImage(imgs,0,0, canvas.width, canvas.height);
            context.arc((data.x), (data.y),20, 0, 2*Math.PI, false);
            context.fillStyle = "#ccddff";
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = "#666666";
            context.stroke();  
        };

        $scope.showCoords = function () {
            $scope.x = event.offsetX;
            $scope.y = event.offsetY;
            $scope.coor = "X coords: " + this.x + ", Y coords: " + this.y;
        };
        
//        canvas.width = $scope.imgWidth;
//        canvas.height = $scope.imgHeight;
//        console.log("Canvas width: " + canvas.width);
//        console.log("Canvas height: " + canvas.height);
        context.globalAlpha = 1.0;
        context.beginPath();
        
        function SensorDetailNull(){
            $scope.form.macID = "";
            $scope.form.sensorName = "";
            $scope.form.sensorType = "";
            $scope.form.sensorSubtype = "";
        }
        
        
        $scope.onSensorCreate = function() {
            $scope.loading= true;
            var floorObj = $scope.form;
            var siteKey = floorObj.sitelist; 
            var floorId = floorObj.floorplanlist;
            var deviceId = floorObj.macID;
            var deviceName = floorObj.sensorName;
            var deviceType = floorObj.sensorType;
            var deviceSubtype = floorObj.sensorSubtype;
            var xDevice = ($scope.data.x)*imgscale;
            var yDevice = ($scope.data.y)*imgscale;

            console.log(siteKey); 
            console.log(floorId);
            console.log(deviceId);
            console.log(deviceName);
            console.log(deviceType);
            console.log(deviceSubtype)
            console.log(xDevice);
            console.log(yDevice);

             firebaseFactory.setSensor(siteKey, floorId, deviceId, deviceName, deviceType, deviceSubtype, xDevice, yDevice).then(function() {
                context.clearRect(0,0,600,400);
                context.drawImage(imgs,0,0, canvas.width, canvas.height);
                $scope.x = "";
                $scope.y = "";
                $scope.loading= false;
                SensorDetailNull();
                $scope.$apply();
                alert(deviceName + ' successfully added!');
             }, function(e) {
                 $scope.loading= false;
                 $scope.$apply();
                 alert('This function cannot be performed at the moment!');
             });
        
        }
    }
    
    SensorController.$inject = ['$scope', 'firebaseFactory'];
    
    angular.module('tanandApp').controller('SensorController', SensorController);
    
}());