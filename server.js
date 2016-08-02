var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcryptjs');
var middleware = require('./middleware')(db);
var firebase = require('firebase');

var app = express();
var PORT = process.env.PORT || 3030;

// firebase.initializeApp({
// 	serviceAccount: "",
// 	databaseURL: "https://tanand-demo.firebaseio.com/"
// });

app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.send('Tanand Web Server Root');
});

app.post('/users', function(request, response) {
	var body = _.pick(request.body, 'email', 'password');

	db.user.create(body).then(function (user) {
		response.json(user.toPublicJSON());
	}, function (e) {
		response.status(400).json(e);
		console.log(e);
	});
});

app.post('/users/login', function(request, response) {
	var body = _.pick(request.body, 'email', 'password');

	if(typeof body.email !== 'string' || typeof body.password !== 'string') {
		return response.status(400).send();
	}

	db.user.findOne({
		where: {
			email: body.email
		}
	}).then(function(user) {
		if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
			return response.status(401).send();
		}

		response.json(user.toPublicJSON());
	}, function(e) {
		response.status(500).send();
	});
});

app.post('/billion', function(request, response) {
	var content = _.where(request.body.devices, {
		model: "SG3010-T2"
	});

	content = content[0];
	var timestamp = request.body.time;

	// var devices = _.pick(content, 'devices');
	// var listDevices = devices['devices'];
	// var singlePower = _.where(listDevices, {
	// 	model: "SG3010-T2"
	// });

	var contentPick = _.pick(content, 'mac', 'voltage', 'current', 'activepower', 'mainenergy');

	console.log('PRINT IT DAMN IT ' + JSON.stringify(contentPick));

	db.single_power.create(contentPick).then(function(single_power) {
		response.json(single_power.toJSON());
	}, function(e) {
		response.status(400).json(e);
	});
});

app.post('/3_billion', function(request, response) {
	var body = _.pick(request.body, 'time');
});

app.use(express.static(__dirname + '/public'));

db.sequelize.sync({force: true}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});





