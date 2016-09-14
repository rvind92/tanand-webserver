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
			snapshot.forEach(function(siteKey) {
				sites.push({
					name: siteKey.key
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

        $scope.onSiteEdit = function() {

            var siteObj = $scope.form;

            console.log('THIS IS THE OBJECT: ' + JSON.stringify(siteObj));

            var siteName = siteObj.site;
            var siteKey = (siteName.replace(/ /g, '').toLowerCase());
            var siteAddress = siteObj.address;
            var siteLat = parseFloat(siteObj.latitude);
            var siteLng = parseFloat(siteObj.longitude);

            // if(siteName && siteKey && siteAddress && siteAddress && siteLat && siteLng) {

            //     firebaseFactory.updateSite(siteKey, siteAddress, siteLat, siteLng, siteName).then(function() {
            //         alert(siteName + 'successfully updated!');
            //     }, function(e) {
            //         alert('This function cannot be performed at the moment!');
            //     });

            // } else {
            //     alert('All fields must be filled!');
            // }

            // var filterFloat = function (value) {
            //     if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
            //         .test(value))
            //         return Number(value);
            //     return NaN;
            // }

            console.log(siteName);
            console.log(siteKey);
            console.log(siteAddress);
            console.log(filterFloat(siteLat));
            console.log(filterFloat(siteLng));
            
            
            $scope.form = '';
        }

        $scope.onSiteDelete = function() {

        	var siteObj = $scope.form;

        	var siteName = siteObj.site;
        	var siteKey = (siteName.replace(/ /g, '').toLowerCase());

        	firebaseFactory.deleteSite(siteKey).then(function() {
        		alert("Site successfully deleted!");
        	}, function(e) {
        		alert(e);
        	});

        	$scope.form = '';
        }
    }
    
    SiteEditController.$inject = ['$scope', '$cookieStore', 'firebaseFactory'];
	
	angular.module('tanandApp').controller('SiteEditController', SiteEditController);

}());