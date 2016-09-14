(function() {
    
    var firebaseFactory = function() {
        
        var firebaseFunc = {};
        
        firebaseFunc.setSite = function(siteAddress, siteLat, siteLng, siteName) {
            const rootRef = firebase.database().ref();
            var siteRef = rootRef.child('locationList').push(siteRef);
            return siteRef.set({
                address: siteAddress,
                lat: siteLat,
                lng: siteLng,
                name: siteName
            });
        };
        
        firebaseFunc.setBuilding = function(siteKey, buildingName) {
            const rootRef = firebase.database().ref().child('buildingList');
            var buildingRef = rootRef.child(siteKey).push(buildingRef);
            return buildingRef.set({
                name: buildingName
            });
        };
        
        firebaseFunc.setFloorplan = function(siteKey, buildingKey, floorplanName, floorplanImgUrl) {
            const rootRef = firebase.database().ref().child('buildingList').child(siteKey).child(buildingKey);
            var floorplanRef = rootRef.child('floorplan').push(floorplanRef);
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

        firebaseFunc.deleteSite = function(siteKey) {
            const rootRef = firebase.database().ref();
            var siteRef = rootRef.child('locationList').child(siteKey);
            return siteRef.set(null);
        }

        firebaseFunc.deleteBuilding = function(siteKey, buildingKey) {
            const rootRef = firebase.database().ref().child('buildingList');
            var buildingRef = rootRef.child(siteKey).child(buildingKey);
            return buildingRef.set(null);
        };

        firebaseFunc.deleteFloorplan = function(siteKey, buildingKey, floorplanKey) {
            const rootRef = firebase.database().ref().child('buildingList').child(siteKey).child(buildingKey);
            var floorplanRef = rootRef.child('floorplan').child(floorplanKey);
            return floorplanRef.set(null);
        };

        firebaseFunc.deleteSensor = function(siteKey, floorplanKey, deviceKey) {
            const rootRef = firebase.database().ref().child('deviceList');
            var sensorRef = rootRef.child(siteKey).child(floorplanKey).child(deviceKey);
            return sensorRef.set(null);
        };

        firebaseFunc.updateSite = function(siteKey, siteAddress, siteLat, siteLng, siteName) {
            const rootRef = firebase.database().ref();
            var siteRef = rootRef.child('locationList').child(siteKey);
            return siteRef.update({
                address: siteAddress,
                lat: siteLat,
                lng: siteLng,
                name: siteName
            });
        };

        firebaseFunc.updateBuilding = function(siteKey, buildingKey, buildingName) {
            const rootRef = firebase.database().ref().child('buildingList');
            var buildingRef = rootRef.child(siteKey).child(buildingKey);
            return buildingRef.update({
                name: buildingName
            });
        };

        firebaseFunc.updateFloorplan = function(siteKey, buildingKey, floorplanKey, floorplanName, floorplanImgUrl) {
            const rootRef = firebase.database().ref().child('buildingList').child(siteKey).child(buildingKey);
            var floorplanRef = rootRef.child('floorplan').child(floorplanKey);
            return floorplanRef.update({
                fpImg: floorplanImgUrl,
                name: floorplanName
            });
        };
        
        firebaseFunc.updateSensor = function(siteKey, floorplanKey, deviceKey, deviceName, deviceType, deviceSubType, xDevice, yDevice) {
            const rootRef = firebase.database().ref().child('deviceList');
            var sensorRef = rootRef.child(siteKey).child(floorplanKey).child(deviceKey);
            return sensorRef.update({
                name: deviceName,
                type: deviceType,
                subtype: deviceSubType,
                x: xDevice,
                y: yDevice
            });
        };
        
        return firebaseFunc;
    }
    
    angular.module("tanandApp").factory('firebaseFactory', firebaseFactory);
    
}());