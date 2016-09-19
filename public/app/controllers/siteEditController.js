(function() {

	var SiteEditController = function($scope, $cookieStore, firebaseFactory) {

		var sites = [];
        var mapObj;

        $(document).ready(function() {

            mapObj = new GMaps({
                div: '#map',
                zoom: 16,
                lat: 3.108075,
                lng: 101.583826,
            });

            mapObj.addControl({
                position: 'top_right',
                content: 'Geolocate',
                style: {
                    margin: '5px',
                    padding: '1px 6px',
                    border: 'solid 1px #717B87',
                    background: '#fff'
                },
                events: {
                    click: function() {
                        GMaps.geolocate({
                            success: function(position) {
                                map.setCenter(position.coords.latitude, position.coords.longitude);
                            },
                            error: function(error) {
                                alert('Geolocation failed: ' + error.message);
                            },
                            not_supported: function() {
                                alert("Your browser does not support geolocation");
                            }
                        });
                    }
                }
            });

            $('#geocoding_form').submit(function(e) {
                e.preventDefault();

                GMaps.geocode({
                    address: $('#address').val(),
                    callback: function(results, status) {
                        if (status == 'OK') {
                            var latlng = results[0].geometry.location;
                            mapObj.setCenter(latlng.lat(), latlng.lng());
                            mapObj.addMarker({
                                lat: latlng.lat(),
                                lng: latlng.lng(),
                                infoWindow: {
                                    content: '<b>Latitude: </b>' + latlng.lat() + '<br><b> Longitude: </b>' + latlng.lng()
                                }
                            });
                        }
                    }
                });
            });
        });

        var sitesLoaded = firebase.database().ref('locationList');
		sitesLoaded.on('value', function(snapshot) {
			console.log('VALUE ACTIVE');
			while(sites.length > 0) {
					sites.pop();
				}
			snapshot.forEach(function(siteKey) {
				sites.push({
					name: siteKey.val().name,
                    ID : siteKey.key
				});
			});
            $scope.$apply();
			console.log('This is: ' + JSON.stringify(sites));

		}, function() {
			alert('No site(s) available at the moment.');
		});

		$scope.site = {
			site : null,
			availableOptions: sites
		};

        $scope.showHiddenFields = function(value) {
            $scope.fieldsdiv = true;

            var siteInfo = firebase.database().ref('locationList').child(value);
            siteInfo.on('value', function(snapshot) {
                var site = snapshot.val();
                $scope.siteInfo = "Current site info " + "\nNAME: " + site.name + "\nADDRESS: " + site.address + "\nLATITUDE: " + site.lat + "\nLONGITUDE: " + site.lng ;
            }, function(e) {

            });
            
        }

        $scope.onSiteEdit = function() {

            var siteObj = $scope.form;
			$scope.loading= true;
            console.log('THIS IS THE OBJECT: ' + JSON.stringify(siteObj));

            var siteKey = siteObj.site;
            var siteName = siteObj.sitename;
            var siteAddress = siteObj.address;
            var siteLat = parseFloat(siteObj.latitude);
            var siteLng = parseFloat(siteObj.longitude);

            var filterFloat = function (value) {
                if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
                    .test(value))
                    return Number(value);
                return NaN;
            }

            if(siteName && siteKey && siteAddress && siteAddress && siteLat && siteLng) {

                firebaseFactory.updateSite(siteKey, siteAddress, siteLat, siteLng, siteName).then(function() {
					$scope.loading= false;
				$scope.$apply();
                    alert(siteName + 'successfully updated!');
                }, function(e) {
					$scope.loading= false;
				$scope.$apply();
                    alert('This function cannot be performed at the moment!');
                });

            } else {
				$scope.loading= false;
				$scope.$apply();
                alert('All fields must be filled!');
            }

            console.log('Site key: ' + siteKey);
            console.log('Site name: ' + siteName);
            console.log('Address: ' + siteAddress);
            console.log('Latitude: ' + filterFloat(siteLat));
            console.log('Longitude: ' + filterFloat(siteLng));
            
            $scope.form = '';
        }

        $scope.onSiteDelete = function() {

        	var siteObj = $scope.form;
//			$scope.loading= true;
        	var siteKey = siteObj.site;
            var siteName = siteObj.sitename;

        	firebaseFactory.deleteSite(siteKey).then(function() {
				$scope.loading= false;
				
				$scope.form = '';
//				$scope.$apply();
        		alert("Site successfully deleted!");
        	}, function(e) {
				$scope.loading= false;
//				$scope.$apply();
        		alert(e);
        	});

        	
        }
    }
    
    SiteEditController.$inject = ['$scope', '$cookieStore', 'firebaseFactory'];
	
	angular.module('tanandApp').controller('SiteEditController', SiteEditController);

}());