(function() {

    var SiteController = function($scope, firebaseFactory) {

        $scope.onSiteSubmit = function() {

            var siteObj = $scope.form;

            console.log();

            var siteName = siteObj.site;
            var siteKey = (siteName.replace(/ /g, '').toLowerCase());
            var siteAddress = siteObj.address;
            var siteLat = parseFloat(siteObj.latitude);
            var siteLng = parseFloat(siteObj.longitude);

            var filterFloat = function (value) {
                if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
                    .test(value))
                    return Number(value);
                return NaN;
            }

            console.log(siteName);
            console.log(siteKey);
            console.log(siteAddress);
            console.log(filterFloat(siteLat));
            console.log(filterFloat(siteLng));
            
            firebaseFactory.setSite(siteKey, siteAddress, siteLat, siteLng, siteName).then(function() {
                alert(siteName + 'successfully added!');
                $scope.form = '';
            }, function() {
                alert('This function cannot be performed at the moment!');
            });
        }
    }
    
    SiteController.$inject = ['$scope', 'firebaseFactory'];
    
    angular.module('tanandApp').controller('SiteController', SiteController);
    
}());