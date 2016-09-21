(function() {
    
    var SensorEditController = function ($scope, firebaseFactory) {
        
        var sites = [];
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var imgs, imgscale;
        var buildings = [];
        var newbuildings = [];
        var floorplans = [];
        var newfloorplans = [];
        
        var macData = [];
        var circles = [];
        var theCircle = function(x, y, radius, deviceID) {
                this.left = x - radius;
                this.top = y - radius;
                this.right = x + radius;
                this.bottom = y + radius;
                this.deviceID = deviceID;
        };
        var config = [];

        var sitesLoaded = firebase.database().ref('locationList');
        sitesLoaded.on('value', function(snapshot) {
            while(sites.length>0){
                sites.pop();
            }
           snapshot.forEach(function(siteKey) {
            sites.push({
                ID:siteKey.key,
              name: siteKey.val().name
            });
           });
           $scope.$apply();
           console.log('This is: ' + JSON.stringify(sites));
        
        }, function() {
            alert('No site(s) available at the moment.');
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
                       ID:buildingKey.key,
                       name: buildingKey.val().name
                   });
               });
                $scope.$apply();
                console.log('This is: ' + JSON.stringify(buildings));
            
            }, function(e) {
                alert('No building(s) available at the moment.');
            });
        
            $scope.buildinglist = {
               building: null,
               availableOptions: buildings
            };
        }
        
        $scope.updateNewBuildingSelect = function(value) {
            console.log(value + ' has been selected!');
            var buildingsLoaded = firebase.database().ref('buildingList').child(value);
            buildingsLoaded.on('value', function(snapshot) {
                while(newbuildings.length > 0) {
                    newbuildings.pop();
                }
               snapshot.forEach(function(buildingKey) {
                   newbuildings.push({
                       ID: buildingKey.key,
                       name: buildingKey.val().name
                   });
               });
                $scope.$apply();
                console.log('This is: ' + JSON.stringify(newbuildings));
            
            }, function(e) {
                alert('No building(s) available at the moment.');
            });
        
            $scope.newbuildinglist = {
               availableOptions: newbuildings
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
                $scope.$apply();
                console.log('This is: ' + JSON.stringify(floorplans));
            
            }, function(e) {
                alert('No building(s) available at the moment.');
            });
        
            $scope.floorplanlist = {
               floorplan: null,
               availableOptions: floorplans
            };
        }
        
        $scope.updateNewFloorplanSelect = function(sitekey, buildingkey) {
            console.log(buildingkey + ' has been selected!');
            var floorplansLoaded = firebase.database().ref('buildingList').child(sitekey).child(buildingkey).child('floorplan');
            floorplansLoaded.on('value', function(snapshot) {
                while(newfloorplans.length > 0) {
                    newfloorplans.pop();
                }
               snapshot.forEach(function(floorplanKey) {
                   newfloorplans.push({
                       ID: floorplanKey.key,
                       name: floorplanKey.val().name
                   });
               });
                $scope.$apply();
                console.log('This is: ' + JSON.stringify(newfloorplans));
            
            }, function(e) {
                alert('No building(s) available at the moment.');
            });
        
            $scope.newfloorplanlist = {
               availableOptions: newfloorplans
            };
        }
            
        $scope.floorplanImg = function(sitekey, buildingkey,floorplanKey) {
            var floorplanImg;
            console.log(buildingkey + ' has been selected!');
            var imgLoaded = firebase.database().ref('buildingList').child(sitekey).child(buildingkey).child('floorplan').child(floorplanKey).child('fpImg');
            imgLoaded.on('value', function(snapshot) {
                while(macData.length>0){
                    macData.pop();
                }
                floorplanImg = snapshot.val();
                console.log('floorplan img: ' + JSON.stringify(floorplanImg));
                
                macData.length = 0; //clear the array by setting the length as 0
                circles.length = 0;
                const rootRef = firebase.database().ref('deviceList').child(sitekey).child(floorplanKey);
                rootRef.on('value', function(snapshot) {
                   snapshot.forEach(function(macID){
                       macData.push({
                           "x": macID.val().x,
                           "y": macID.val().y,
                           "ID": macID.key
                       })
                   }) 
                    imagesload(floorplanImg);
                    $scope.$apply();
                    
                        
                });
            }, function(e) {
            
                alert('No building(s) available at the moment.');
            });
        
        };
        
        
        canvas.addEventListener('click', function(e) {  // use event argument
            
            var rect = canvas.getBoundingClientRect();  // get element's abs. position
            var clickedX = e.clientX - rect.left;              // get mouse x and adjust for el.
            var clickedY = e.clientY - rect.top;               // get mouse y and adjust for el.
            
            var floorObj = $scope.form;
            var siteKey = floorObj.sitelist; 
            var buildingKey = floorObj.buildinglist;
            var floorID = floorObj.floorplanlist;
            var deviceID;
            
            for (var i = 0; i < circles.length; i++) {
                    if (clickedX < circles[i].right && clickedX > circles[i].left && clickedY > circles[i].top && clickedY < circles[i].bottom) {
                         deviceID = circles[i].deviceID;
                         alert(deviceID);
                        
                        var dataLoaded = firebase.database().ref('deviceList').child(siteKey).child(floorID).child(deviceID);
                        dataLoaded.on('value', function(snapshot){
                            document.getElementById('sensortype').value = snapshot.val().type;
                            document.getElementById('subtype').value = snapshot.val().subtype;
                            document.getElementById('macID').value = deviceID;
                            document.getElementById('sensorName').value = snapshot.val().name;
                            document.getElementById('x').value = (snapshot.val().x)/imgscale;
                            document.getElementById('y').value = (snapshot.val().y)/imgscale;
                        });
                    }
                }
        });
        
        $scope.handleSelect = function() {
             if (this.value == 't' || this.value == 'p') {
                 document.getElementById('subtype').disabled = true;
             } else {
                 document.getElementById('subtype').disabled = false;
             }
         };
        
        function imagesload(floorPlanURL){
            var img = new Image();
            imgs = img;
            img.onload = function(){ 
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
//                console.log("Canvas width: " + canvas.width);
//                console.log("Canvas height: " + canvas.height);
//                console.log("This is image Height: " +$scope.imgHeight);
//                console.log("This is image Width: " +$scope.imgWidth);
                $scope.addData();
            };
            img.onerror=function(){
                //alert("image load failed");
            } 
            img.src = floorPlanURL;
            $scope.hidecoor =true;
            $scope.sensordiv = true;
        }

        $scope.addData = function() {
            for(var i = 0; i < macData.length; i++){
                var circle = new theCircle((macData[i].x)/imgscale, (macData[i].y)/imgscale, 20, macData[i].ID);
                circles.push(circle);
                console.log(circle);
                
                $scope.x = (macData[i].x)/imgscale;
                $scope.y = (macData[i].y)/imgscale;
                $scope.data = {x: $scope.x, y: $scope.y};
                console.log($scope.data);
                drawDot($scope.data);
            }
        };
        
        $scope.validateForm = function() {
            var newsitelist = document.forms["everything"]["newsitelist"].value;
            var newbuildinglist = document.forms["everything"]["newbuildinglist"].value;
            var newfloorplanlist = document.forms["everything"]["newfloorplanlist"].value;
            if (newsitelist == null || newsitelist == "") {
                alert("The new site list must be selected");
                return false;
            }
            else if (newbuildinglist == null || newbuildinglist == "") {
                alert("The new building list must be selected");
                return false;
            }
            else if (newfloorplanlist == null || newfloorplanlist == "") {
                alert("The new floorplan list must be selected");
                return false;
            }
            else{
                $scope.onSensorEdit();
            }
        }
        

        function drawDot(data) {
            context.beginPath();
            //console.log(data);
            //context.clearRect(0,0,600,400);
            //context.drawImage(imgs,0,0, canvas.width, canvas.height);
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
        
        
        $scope.onSensorEdit = function() {
             $scope.loading= true;
            var floorObj = $scope.form;
            var siteKey = floorObj.sitelist; 
            var buildingId = floorObj.buildinglist;
            var floorId = floorObj.floorplanlist;
            
            var deviceId = document.getElementById('macID').value
            var deviceName = document.getElementById('sensorName').value
            var deviceType = document.getElementById('sensortype').value
            var deviceSubtype = document.getElementById('subtype').value
            var xDevice = (document.getElementById('x').value)*imgscale;
            var yDevice = (document.getElementById('y').value)*imgscale;
            
            var floorEdit = $scope.edit;
            var siteEdit = floorEdit.newsitelist;
            var buildingEdit = floorEdit.newbuildinglist;
            var floorIdEdit = floorEdit.newfloorplanlist;

            console.log(siteEdit); 
            console.log(floorIdEdit);
            console.log(deviceId);
            console.log(deviceName);
            console.log(deviceType);
            console.log(deviceSubtype);
            console.log(xDevice);
            console.log(yDevice);
               
             firebaseFactory.deleteSensor(siteKey, floorId, deviceId).then(function() {
                 alert(deviceName + ' successfully removed from '+ floorId + ' !');
             }, function(e) {
                 alert('This function cannot be performed at the moment!');
             });

             firebaseFactory.updateSensor(siteEdit, floorIdEdit, deviceId, deviceName, deviceType, deviceSubtype, xDevice, yDevice).then(function() {
                 $scope.floorplanImg(siteKey, buildingId, floorId);
                 $scope.loading= false;
                 SensorDetailNull();
                 $scope.edit='';
                 while(newbuildings.length > 0) {
                    newbuildings.pop();
                }
                while(newfloorplans.length > 0) {
                    newfloorplans.pop();
                }
                 $scope.$apply();
                 alert(deviceName + ' successfully moved to ' + floorIdEdit + ' !');
             }, function(e) {
                 $scope.loading= false;
                $scope.$apply();
                 alert('This function cannot be performed at the moment!');
                 
             });
        
        }
        
        function SensorDetailNull(){
            document.getElementById('macID').value = null;
            document.getElementById('sensorName').value = null;
            document.getElementById('sensortype').value = null;
            document.getElementById('subtype').value = null;
            document.getElementById('x').value = null;
            document.getElementById('y').value = null;
        }
        
        $scope.onSensorDelete = function() {
            $scope.loading= true;
            var floorObj = $scope.form;
            var siteKey = floorObj.sitelist; 
            var buildingId = floorObj.buildinglist;
            var floorId = floorObj.floorplanlist;
            var deviceId = document.getElementById('macID').value
            var deviceName = document.getElementById('sensorName').value
    
            console.log(siteKey); 
            console.log(floorId);
            console.log(deviceId);
            console.log(deviceName);

            firebaseFactory.deleteSensor(siteKey, floorId, deviceId).then(function() {
                $scope.floorplanImg(siteKey, buildingId, floorId);
                $scope.loading= false;
                SensorDetailNull();
                $scope.edit='';
                $scope.$apply();
                alert(deviceName + ' successfully removed from '+ floorId + ' !');
            }, function(e) {
                $scope.loading= false;
                $scope.$apply();
                alert('This function cannot be performed at the moment!');
            });
        
        }
    }
    SensorEditController.$inject = ['$scope', 'firebaseFactory'];
    
    angular.module('tanandApp').controller('SensorEditController', SensorEditController);
    
}());