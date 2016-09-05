(function() {
    
    var SiteController = function($scope, fireFactory) {
        
        var site = $scope.site;
        var siteKey = (site.replace(/ /g, '').toLowerCase());
        var address = $scope.address;
        var lat = $scope.lat;
        var lng = $scope.lng;
        
        function init() {
            fireFactory.setSite(siteKey, address, lat, lng, site)
                .then(function() {
                $scope.site = "";
                $scope.address = "";
                $scope.lat = "";
                $scope.lng = "";
            }, function() {
                alert('Unable to perform action at the moment');
            });
        }
        
        init();
    }
    
    SiteController.$inject = ['$scope', 'fireFactory'];
    
    angular.module('tanandApp').controller('SiteController', SiteController);
    
}());