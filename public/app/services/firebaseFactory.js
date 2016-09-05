(function() {
    
    var firebaseFactory = function() {
        
        var firebase = {};
        
        firebase.setSite = function(siteKey, siteAddress, siteLat, siteLng, siteName) {
            const rootRef = firebase.database().ref();
            var siteRef = rootRef.child('locationList');
            return siteRef.set({
                siteKey: {
                    address: siteAddress,
                    lat: siteLat,
                    lng: siteLng,
                    name: siteName
                }
            });
        };
        
        firebase.setBuilding = function(siteKey, buildingKey, buildingName) {
            const rootRef = firebase.database().ref().child('buildingList');
            var buildingRef = rootRef.child(siteKey);
            return buildingRef.set({
                buildingKey: {
                    name: buildingName
                }
            });
        };
        
        firebase.setFloorplan = function(siteKey, buildingKey, floorplanKey, floorplanImgUrl, floorplanName) {
            const rootRef = firebase.database().ref().child('buildingList').child(siteKey).child(buildingKey);
            var floorplanRef = rootRef.child('floorplan');
            return floorplanRef.set({
                floorplanKey: {
                    fpImg: floorplanImgUrl,
                    name: floorplanName
                }
            });
        };
        
        firebase.setSensor = function(siteKey, floorplanKey, deviceKey, deviceName, deviceType, xDevice, yDevice) {
            const rootRef = firebase.database().ref().child('deviceList');
            var sensorRef = rootRef.child(siteKey).child(floorplanKey);
            return sensorRef.set({
                deviceKey: {
                    name: deviceName,
                    type: deviceType,
                    x: xDevice,
                    y: yDevice
                }
            });
        };
        
        firebase.update = function() {
            
        };
        
        firebase.delete = function() {
            
        };
        
        return firebase;
    }
    
//    firebaseFactory.$inject = ['$firebaseObject'];
    
    angular.module("tanandApp").factory('firebaseFactory', firebaseFactory);
    
}());