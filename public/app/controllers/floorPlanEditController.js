(function() {
    var FloorplanEditController= function($scope, firebaseFactory) {
        var sites = [];
        var buildings = [];
        var floorplans = [];
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var imgs, imgscale;
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
            
        $scope.floorplanImg = function(sitekey, buildingkey, floorplanKey) {
            var floorplanImg;
            console.log(buildingkey + ' has been selected!');
            var imgLoaded = firebase.database().ref('buildingList').child(sitekey).child(buildingkey).child('floorplan').child(floorplanKey);
            imgLoaded.on('value', function(snapshot) {
                $scope.form.floorplanname = snapshot.val().name;
                floorplanImg = snapshot.val().fpImg;
                console.log('floorplan img: ' + JSON.stringify(floorplanImg));
                imagesload(floorplanImg);
            
            }, function(e) {
                // alert('No building(s) available at the moment.');
            });
        
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
                console.log("Canvas width: " + canvas.width);
                console.log("Canvas height: " + canvas.height);
                console.log("This is image Height: " +$scope.imgHeight);
                console.log("This is image Width: " +$scope.imgWidth);
            };
            img.onerror=function() {
//              alert("image load failed");
            } 
            img.src = floorPlanURL;
            $scope.hidecoor =true;
            $scope.sensordiv = true;
        }
        document.getElementById('file').addEventListener('change', handleFileSelect, false);
        
        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            file = evt.target.files[0];
            metadata = {
                'contentType': file.type
            };
            console.log(metadata);
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
            document.getElementById('file').value = "";
            document.getElementById('blah').src = "";
        };
        $scope.onFloorplanCreate = function() {
            $scope.loading= true;
            var floorObj = $scope.form;
            var newImage = file.name;
            var siteKey = floorObj.sitelist;
            var buildKey = floorObj.buildinglist;
            var floorId = floorObj.floorplanlist;
            var floorName = floorObj.floorplanname;
            var floorUrl;
            var fileName
            var imageName
            
            console.log('asd'+ newImage)
            console.log('FAILED AT SITE: ' + siteKey);
            console.log('FAILED AT BUILD: ' + buildKey);
            console.log('FAILED AT FLOORID: ' + floorId);
            console.log('FAILED AT FLOORNAME: ' + floorName);
            console.log('FAILED AT FLOORURL: ' + floorUrl);
            if(typeof file === 'undefined' || file === null) {
                firebaseFactory.updateFloorplanWithoutImage(siteKey, buildKey, floorId, floorName).then(function() {
                    $scope.loading = false;
                    $scope.$apply();
                    alert("Success add");
                    $scope.form = "";
                }, function(e) {
                    alert('This function cannot be performed at the moment!');
                });
                
            } else {
                var name =
                firebase.database().ref('buildingList').child(siteKey).child(buildKey).child('floorplan').child(floorId);
                name.once('value', function(snapshot) {
                    fileName = snapshot.val().name;
                    imageName =snapshot.val().fileName;
                    var floorPlanDelete = storageRef.child(siteKey).child(buildKey).child(fileName+'/'+imageName);
                    floorPlanDelete.delete().then(function() {        
                        storageRef.child(siteKey + '/' + buildKey + '/' + floorName + '/' + newImage).put(file, metadata).then(function(snapshot) {
                        floorUrl = snapshot.metadata.downloadURLs[0];
                        console.log('File available at', floorUrl);
                        console.log(" THis is mid" + floorName)
                            firebaseFactory.updateFloorplan(siteKey, buildKey,floorId, floorName, floorUrl, newImage).then(function() {
                                    $scope.loading = false;
                                    $scope.form =null;
                                    while(buildings.length > 0) {
                                        buildings.pop();
                                    }
                                    while(floorplans.length > 0) {
                                        floorplans.pop();
                                    }
                                    context.clearRect(0,0,600,400);
                                    imgs = "";
                                    $scope.reset();
                                    $scope.sensordiv = false;
                                    $scope.$apply();
                                    console.log("Success updated floorplan!");
                                    
                                }, function(e) {
                                    $scope.loading = false;
                                    $scope.$apply();
                                    alert('This function cannot be performed at the moment!');
                            });
                    }).catch(function(error) {
                       $scope.loading= false;
                        $scope.$apply();
                        console.error('Upload failed:', error);
                    });
                    }).catch(function(error) {
                                
                });
                  
                }, function(e) {
                    
                    // alert('No building(s) available at the moment.');
                });
                
                
                
            }
        }
        $scope.onFloorplanDelete = function() {
            $scope.loading= true;
            var floorObj = $scope.form;
            var siteKey = floorObj.sitelist; 
            var buildingKey = floorObj.buildinglist;
            var floorplanKey = floorObj.floorplanlist; 
        
            var name =
            firebase.database().ref('buildingList').child(siteKey).child(buildingKey).child('floorplan').child(floorplanKey);
            name.on('value', function(snapshot) {
                var fileName = snapshot.val().name;
                var imageName =snapshot.val().fileName;
                    firebaseFactory.deleteFloorplan(siteKey, buildingKey, floorplanKey).then(function() {
                        var floorPlanDelete = storageRef.child(siteKey).child(buildingKey).child(fileName+'/'+imageName);
                        floorPlanDelete.delete().then(function() {
                            context.clearRect(0,0,600,400);
                            //imgs = "";
                            $scope.loading= false;
                            $scope.form =null;
                            while(buildings.length > 0) {
                                buildings.pop();
                            }
                            while(floorplans.length > 0) {
                                floorplans.pop();
                            }
                            $scope.$apply();
                            alert(deviceName + ' successfully removed from '+ floorId + ' !');
                        }).catch(function(error) {
                            context.clearRect(0,0,600,400);
                            $scope.loading= false;
                            $scope.form =null;
                            $scope.sensordiv = false;
                            $scope.$apply();
                        });
                 }, function(e) {
                    $scope.loading= false;
                    $scope.$apply();
                     alert('This function cannot be performed at the moment!');
                 });
            
            }, function(e) {
                // alert('No building(s) available at the moment.');
            });
        }
    }
    FloorplanEditController.$inject = ['$scope', 'firebaseFactory'];
    
    angular.module('tanandApp').controller('FloorplanEditController', FloorplanEditController);
}());