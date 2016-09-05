(function() {
    
    var SiteController = function($scope, firebaseFactory) {
        
        $scope.onSiteSubmit = function() {
            
            var siteName = $scope.site;
            var siteKey = (site.replace(/ /g, '').toLowerCase());
            var siteAddress = $scope.address;
            var siteLat = $scope.lat;
            var siteLng = $scope.lng;
            
            firebaseFactory.setSite(siteKey, siteAddress, siteLat, siteLng, siteName).then(function() {
                alert(siteName + 'successfully added!');
                $scope.site = '';
                $scope.address = '';
                $scope.lat = '';
                $scope.lng = '';
            }, function() {
                alert('This function cannot be performed at the moment!');
            });
        }
    }
    
    SiteController.$inject = ['$scope', 'firebaseFactory'];
    
    angular.module('tanandApp').controller('SiteController', SiteController);
    
}());