var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcryptjs');
var middleware = require('./middleware')(db);
var firebase = require('firebase');
var cryptojs = require('crypto-js');
var moment = require('moment');

firebase.initializeApp({
	serviceAccount: {
		projectId: "tanand-demo",
		clientEmail: "tanand-web-server@tanand-demo.iam.gserviceaccount.com",
		privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEwAIBADANBgkqhkiG9w0BAQEFAASCBKowggSmAgEAAoIBAQDa58FOlnufAQH0\nU4i3UCCa1zRy/EyMY6PmLbrlI+po2QuWTLvSqE54wsAPCjoOjytfXZIf4ey4BLv8\n46dcmL0tbLHqBa8JUDgXi5xr0Qa66HhoG1Fv8ABFSOqNK0oTQ/zVktHCcQRVcUvk\n3Vurhmc8OpJmgnHt8iDmzyA9sJoGrIg9lkk1FTJBsy8i/nLht0RNUa7f0ZVpj16P\nAC2XXC5KQ0/FHLpzgW5wi45AFf6yFxQ5Y0i2AmCo9A0JAuqOWduwPSw7OzlPeBCk\nnlFSp9iS9IuXLmcC9NbmLvggjEtxG4tfUyqqk11Gta2EcdUGy43nyQW7S7S0Ayms\npb6Y7rnBAgMBAAECggEBAMX4E91DwHbzDVZt+VV3NJV0DK30uDG6pu4y6zPxQDwk\nFhOOP8pqhdU2o0S2xfyGw/3R/KWyx0dAmNZC+AeI5oVfKKNxEnRExQWeMA9dkU2V\nkdbs5cBq94OxRtX2kV5M/SoVRngnh3jSJoXLHu1HdrOEcQQd8nTzpYe3R/wia5md\n382RDz/g6xEfmUEtEWX3nDHIWavsWzF6h3WjJQZu59UfxK+3VH0N/6qfx/Cb7DE1\n4EKCOYB8m9g6x2ef+igfGOuDKjj+Of8pm52nNtT4ikfwUL4kdHLZFCK0Yf5vdIfj\nvtEe3XKp1WVZJJUuGz0GoCurFYs3K/uuK9gEvVg7VAECgYEA/TrK5GgpWGcI9FAd\nG99ZIOCeXSttE/TezqrTEdZZW1k2paOqENkiGgDbE3YIshUkNmT8xxa6P8Go+Rz3\nrBRsDkq4IbV7/WGLfqf4tNCIHk3hKjAxStBMEtbuaEQrRYKOcCVysIwBz/FrRRj1\n8DmQbbVgIeR3lwzIDfKCIImIo+ECgYEA3UzVAUV2m8Frjz/jmuMBXRgVTfrxmnpp\n+OEr88oU825hNPRx9SQ0ARWR3LFjr5kBQIYYCsUAaxIadz4MXjWtwFu6PRZzLhoG\nmE4NpeOVMaYLpnuo9HI3Hv+0b9WH7nWWmfaYvn7tJ8OnosAfLarjjSMDwdlxZuRK\nwlfINOuM0eECgYEA6BMfquCDM8+J904Mv2Sb7HOu7zhDSUzbfZA0zF4jmoJSgM9T\npwk4JZivLlC4e2zAuVEoENWVb6TuVQ/lNEGrHhYAVnRa48an7zXFywBqH0vElcOB\nCU2IyqNL7ya6eYPDQqgvSfmmF4rrgnHzw2seIE1fgvA9YaOHHLEp7OPe5EECgYEA\nvIP6375gr4YxLjJqnULLopYlb+xZbBLju1N1sZNwDX7157pkaUOR2WqaernSBX/9\nhQ215Va0aIFfcjy1JHvtq3N4TxmUvK0G+S9kiPA547VjL0sgPjwdoJaLCsmHpicd\nR8K9k2lkdP9DCm1HIgv1FAHD7Zph9Bh9ZtiIgCw4JYECgYEAosGbEqmzUvzt5L20\n0zvO6BMJ0TePQIycLl6JpViaid0o46KQ5Vy0DZVnxxo1OGgSm+xY5VaLkvMKKt1M\nm45PcRhnUvVgMpPhutH08n5CN3h4aUlXZ13KuPfeVjqAnulrCkPK/U2D4jwhBx+2\nZSXlpYdwB59EFCbF3PxDF00Oyds=\n-----END PRIVATE KEY-----\n",
	},
	databaseURL: "https://tanand-demo.firebaseio.com/"
});

var app = express();
var PORT = process.env.PORT || 3030;

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
	var userInstance;
	var uid = body.email;
	var customToken = firebase.auth().createCustomToken(uid);
	var tokenTime = parseInt(Date.now() / 1000);

	db.user.authenticate(body).then(function(user) {
		var newToken = user.generateToken('authentication');
		console.log('THIS IS THE TOKEN: ' + newToken + '\n');
		userInstance = user;

		return db.token.create({
			token: newToken,
			iat: tokenTime
		});

	}).then(function(tokenInstance) {
		response.header('UnixTime', tokenInstance.get('iat'));
		response.header('FirebaseToken', customToken);
		response.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
		// response.header('FirebaseToken', customToken.get('customToken')).json(userInstance.toPublicJSON());
	}).catch(function(e) {
		console.log(e);
		response.status(401).send();
	});
});

app.post('/billion', middleware.handleHeader, function(request, response) {
	
	var singlePowerMeter = _.where(request.body.devices, {
		model: "SG3010-T2"
	});

	var triplePowerMeter = _.where(request.body.devices, {
		model: "SG3030"
	});

	var temperatureSensor1 = _.where(request.body.devices, {
		model: "SG110-A"
	});

	var temperatureSensor2 = _.where(request.body.devices, {
		model: "SG110-TSA"
	});

	console.log(request.get('Expect'));
	var time = moment.unix(request.body.time).format("YYYY-MM-DD HH:mm:ss.SSS");

	singlePowerMeterObject = singlePowerMeter[0];
	triplePowerMeterObject = triplePowerMeter[0];
	temperatureSensorObject1 = temperatureSensor1[0];
	temperatureSensorObject2 = temperatureSensor2[0];

	singlePowerMeterObject.timestamp = time;
	triplePowerMeterObject.timestamp = time;
	temperatureSensorObject1.timestamp = time;
	temperatureSensorObject2.timestamp = time;

	var spm = _.pick(singlePowerMeterObject, 'mac', 'voltage', 'current', 'activepower', 'mainenergy', 'timestamp','powerfactor','status');
	var tpm = _.pick(triplePowerMeterObject, 'mac', 'voltage', 'voltage2', 'voltage3', 'current', 'current2', 'current3', 'activepower', 'activepower2', 'activepower3', 'mainenergy', 'mainenergy2', 'mainenergy3', 'timestamp','powerfactor','status');

	var ts1 = _.pick(temperatureSensorObject1, 'mac', 'temperature', 'humidity', 'BatteryVoltage', 'timestamp');
	var ts2 = _.pick(temperatureSensorObject2, 'mac', 'temperature', 'humidity', 'BatteryVoltage', 'timestamp');

	var macID = tpm.mac;

	db.single_power.create(spm).then(function(single_power) {
		var db = firebase.database();
		var ref = db.ref('readingPowerList').child("iskl").child(macID);
		ref.update({
			activepower: parseFloat(spm.activepower),
			current:parseFloat(spm.current),
			mainenergy: parseFloat(spm.mainenergy),
			powerfactor: parseFloat(spm.powerfactor),
			voltage:parseFloat(spm.voltage),
			status:parseInt(spm.status)
		});
		response.status(200).send();
	}, function(e) {
		response.status(400).json(e);
	});

	db.triple_power.create(tpm).then(function(triple_power) {
		response.status(200).send();
		// var db = firebase.database();
		// var ref = db.ref('readingPowerList').child("iskl").child(macID);
		// ref.update({
		// 	activepower: parseFloat(tpm.activepower),
		// 	activepower2:parseFloat(tpm.activepower2),
		// 	activepower3:parseFloat(tpm.activepower3),
		// 	current:parseFloat(tpm.current),
		// 	current2:parseFloat(tpm.current2),
		// 	current3:parseFloat(tpm.current3),
		// 	mainenergy: parseFloat(tpm.mainenergy),
		// 	mainenergy2:parseFloat(tpm.mainenergy2),
		// 	mainenergy3:parseFloat(tpm.mainenergy3),
		// 	powerfactor: parseFloat(tpm.powerfactor),
		// 	voltage:parseFloat(tpm.voltage),
		// 	voltage2:parseFloat(tpm.voltage2),
		// 	voltage3:parseFloat(tpm.voltage3),
		// 	status:praseInteger(tpm.status)
		// });
	}, function(e) {
		response.status(400).json(e);
	});

	db.temp_humid.create(ts1).then(function(temp_humid) {
		var db = firebase.database();
		var ref = db.ref('readingTempList').child("iskl").child(macID);
		ref.update({
			humidity: parseFloat(ts1.humidity),
			temperature:parseFloat(ts1.temperature),
		
		});
		response.status(200).send();
	}, function(e) {
		response.status(400).json(e);
	});

	db.temp_humid.create(ts2).then(function(temp_humid) {
		// var db = firebase.database();
		// var ref = db.ref('readingTempList').child("iskl").child(macID);
		// ref.update({
		// 	humidity: parseFloat(ts2.humidity),
		// 	temperature:parseFloat(ts2.temperature),

		// });
		response.status(200).send();
	}, function(e) {
		response.status(400).json(e);
	});

});

// app.get('/trending', function(request, response) {
// 	db.single_power.findByAl

// 	response.json(single_power).send();
// });

app.delete('/users/login', middleware.requireAuthentication, function(request, response) {
	request.token.destroy().then(function() {
		response.status(204).send();
	}).catch(function() {
		response.status(500).send();
	});
});

app.get('/users/login', function(request, response) {
	var requestHeader = request.get('Auth');

	db.token.findOne({
		tokenHash: cryptojs.MD5(requestHeader).toString()
	}).then(function(tokenValue) {
		if(!tokenValue) {
			console.log('Forbidden\n');
			response.setHeader('Forbidden', 'true');
			response.status(403).send();
		} else {
			response.setHeader('Forbidden', 'false');
			response.status(204).send();
		}
	})
});

app.use(express.static(__dirname + '/public'));

db.sequelize.sync({force: true}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});





