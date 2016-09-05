(function() {
    
    var fireFactory = function($firebaseOject) {
        
        var firebase = {};
        
        firebase.setSite = function(siteKey, address, lat, lng, siteName) {
            const rootRef = firebase.database().ref().child('locationList');
            var siteRef = rootRef.child(siteKey);
            return siteRef.set({
                address: address,
                lat: lat,
                lng: lng,
                site: site
            });
        };
        
        firebase.setBuilding = function(siteKey, buildingKey, buildingName) {
            const rootRef = firebase.database().ref().child('buildingList').child(siteKey);
            var buildingRef = rootRef.child().child(buildingKey).child('name');
            return buildingRef.set({
                name: buildingName
            });
        };
        
        firebase.setFloorplan = function(siteKey, buildingKey) {
            const rootRef = firebase.database().ref().child('buildingList').child(siteKey).child(buildingKey);
            var floorplanRef = rootRef.child('floorplan').child(floorplanKey);
            return floorplanRef.set({
                
            });
        };
        
        firebase.setSensor = function() {
            
        };
        
        firebase.update = function() {
            
        };
        
        firebase.delete = function() {
            
        };
        
        return firebase;
    }
    
    fireFactory.$inject = ['$firebaseObject'];
    
    angular.module("tanandApp").factory('fireFactory', fireFactory);
    
}());