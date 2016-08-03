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
	var content1 = _.where(request.body.devices, {
		model: "SG3010-T2"
	});

	var content2 = _.where(request.body.devices, {
		model: "SG3030"
	});

	content1 = content1[0];
	content2 = content2[0];
	var timestamp = request.body.time;

	// var devices = _.pick(content, 'devices');
	// var listDevices = devices['devices'];
	// var singlePower = _.where(listDevices, {
	// 	model: "SG3010-T2"
	// });

	var contentPick1 = _.pick(content1, 'mac', 'voltage', 'current', 'activepower', 'mainenergy');
	var contentPick2 = _.pick(content2, 'mac', 'voltage', 'voltage2', 'voltage3', 'current', 'current2', 'current3', 'activepower', 'activepower2', 'activepower3', 'mainenergy', 'mainenergy2', 'mainenergy3');

	console.log(contentPick2);

	// console.log('PRINT IT DAMN IT ' + JSON.stringify(contentPick1));
	// console.log('PRINT IT DAMN IT ' + JSON.stringify(contentPick2));

	db.single_power.create(contentPick1).then(function(single_power) {
		response.json(single_power.toJSON());
	}, function(e) {
		response.status(400).json(e);
	});

	db.triple_power.create(contentPick2).then(function(triple_power) {
		response.json(triple_power.toJSON());
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





