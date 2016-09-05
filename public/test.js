var list = $firebaseArray(ref);

list.$add({ 
	foo: "bar"
}).then(function(ref) {
	var id = ref.key;
	id = $scope.site;
	const ref = firebase.database().ref('locationList').child(id);
	console.log("added record with id " + id);
	list.$indexFor(id); // returns location in the array
});