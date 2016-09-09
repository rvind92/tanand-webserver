(function() {
    
    var firebaseFactory = function() {
        
        var firebaseFunc = {};
        
        firebaseFunc.setSite = function(siteKey, siteAddress, siteLat, siteLng, siteName) {
            const rootRef = firebase.database().ref();
            var siteRef = rootRef.child('locationList').child(siteKey);
            return siteRef.set({
                address: siteAddress,
                lat: siteLat,
                lng: siteLng,
                name: siteName
            });
        };
        
        firebaseFunc.setBuilding = function(siteKey, buildingKey, buildingName) {
            const rootRef = firebase.database().ref().child('buildingList');
            var buildingRef = rootRef.child(siteKey).child(buildingKey);
            return buildingRef.set({
                name: buildingName
            });
        };
        
        firebaseFunc.setFloorplan = function(siteKey, buildingKey, floorplanKey, floorplanName, floorplanImgUrl) {
            const rootRef = firebase.database().ref().child('buildingList').child(siteKey).child(buildingKey);
            var floorplanRef = rootRef.child('floorplan').child(floorplanKey);
            return floorplanRef.set({
                fpImg: floorplanImgUrl,
                name: floorplanName
            });
        };
        
        firebaseFunc.setSensor = function(siteKey, floorplanKey, deviceKey, deviceName, deviceType, deviceSubType, xDevice, yDevice) {
            const rootRef = firebase.database().ref().child('deviceList');
            var sensorRef = rootRef.child(siteKey).child(floorplanKey).child(deviceKey);
            return sensorRef.set({
                name: deviceName,
                type: deviceType,
                subtype: deviceSubType,
                x: xDevice,
                y: yDevice
            });
        };
        
        firebaseFunc.update = function() {
            
        };
        
        firebaseFunc.delete = function() {
            
        };
        
        return firebaseFunc;
    }
    
//    firebaseFactory.$inject = ['$firebaseObject'];
    
    angular.module("tanandApp").factory('firebaseFactory', firebaseFactory);
    
}());