(function() {

	var EditDeleteController = function($scope, $cookieStore, firebaseFactory) {

		console.log('This is the jwt value from EditDeleteController: ' + $cookieStore.get('jwt'));
        console.log('This is the fbtoken value from EditDeleteController' + $cookieStore.get('firebaseToken'));

		$scope.table = [
			{ buildinglist: 'building 1', floorplanlist: 'floorplan 1', sensorlist: 'sensor 1', sensorname: 'outdoor' },
			{ buildinglist: 'building 2', floorplanlist: 'floorplan 2', sensorlist: 'sensor 2', sensorname: 'indoor' },
			{ buildinglist: 'building 3', floorplanlist: 'floorplan 3', sensorlist: 'sensor 3', sensorname: 'air-cond' },
			{ buildinglist: 'building 4', floorplanlist: 'floorplan 4', sensorlist: 'sensor 4', sensorname: 'temp' },
		];

	}

	EditDeleteController.$inject = ['$scope', '$cookieStore', 'firebaseFactory'];

	angular.module('tanandApp').controller('EditDeleteController', EditDeleteController);

}());