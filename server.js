var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcryptjs');
var middleware = require('./middleware')(db);
var firebase = require('firebase');

var app = express();
var PORT = process.env.PORT || 3030;

firebase.initializeApp({
	serviceAccount: {
		projectId: "tanand-demo",
		clientEmail: "tanand-web-server@tanand-demo.iam.gserviceaccount.com",
		privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEwAIBADANBgkqhkiG9w0BAQEFAASCBKowggSmAgEAAoIBAQDa58FOlnufAQH0\nU4i3UCCa1zRy/EyMY6PmLbrlI+po2QuWTLvSqE54wsAPCjoOjytfXZIf4ey4BLv8\n46dcmL0tbLHqBa8JUDgXi5xr0Qa66HhoG1Fv8ABFSOqNK0oTQ/zVktHCcQRVcUvk\n3Vurhmc8OpJmgnHt8iDmzyA9sJoGrIg9lkk1FTJBsy8i/nLht0RNUa7f0ZVpj16P\nAC2XXC5KQ0/FHLpzgW5wi45AFf6yFxQ5Y0i2AmCo9A0JAuqOWduwPSw7OzlPeBCk\nnlFSp9iS9IuXLmcC9NbmLvggjEtxG4tfUyqqk11Gta2EcdUGy43nyQW7S7S0Ayms\npb6Y7rnBAgMBAAECggEBAMX4E91DwHbzDVZt+VV3NJV0DK30uDG6pu4y6zPxQDwk\nFhOOP8pqhdU2o0S2xfyGw/3R/KWyx0dAmNZC+AeI5oVfKKNxEnRExQWeMA9dkU2V\nkdbs5cBq94OxRtX2kV5M/SoVRngnh3jSJoXLHu1HdrOEcQQd8nTzpYe3R/wia5md\n382RDz/g6xEfmUEtEWX3nDHIWavsWzF6h3WjJQZu59UfxK+3VH0N/6qfx/Cb7DE1\n4EKCOYB8m9g6x2ef+igfGOuDKjj+Of8pm52nNtT4ikfwUL4kdHLZFCK0Yf5vdIfj\nvtEe3XKp1WVZJJUuGz0GoCurFYs3K/uuK9gEvVg7VAECgYEA/TrK5GgpWGcI9FAd\nG99ZIOCeXSttE/TezqrTEdZZW1k2paOqENkiGgDbE3YIshUkNmT8xxa6P8Go+Rz3\nrBRsDkq4IbV7/WGLfqf4tNCIHk3hKjAxStBMEtbuaEQrRYKOcCVysIwBz/FrRRj1\n8DmQbbVgIeR3lwzIDfKCIImIo+ECgYEA3UzVAUV2m8Frjz/jmuMBXRgVTfrxmnpp\n+OEr88oU825hNPRx9SQ0ARWR3LFjr5kBQIYYCsUAaxIadz4MXjWtwFu6PRZzLhoG\nmE4NpeOVMaYLpnuo9HI3Hv+0b9WH7nWWmfaYvn7tJ8OnosAfLarjjSMDwdlxZuRK\nwlfINOuM0eECgYEA6BMfquCDM8+J904Mv2Sb7HOu7zhDSUzbfZA0zF4jmoJSgM9T\npwk4JZivLlC4e2zAuVEoENWVb6TuVQ/lNEGrHhYAVnRa48an7zXFywBqH0vElcOB\nCU2IyqNL7ya6eYPDQqgvSfmmF4rrgnHzw2seIE1fgvA9YaOHHLEp7OPe5EECgYEA\nvIP6375gr4YxLjJqnULLopYlb+xZbBLju1N1sZNwDX7157pkaUOR2WqaernSBX/9\nhQ215Va0aIFfcjy1JHvtq3N4TxmUvK0G+S9kiPA547VjL0sgPjwdoJaLCsmHpicd\nR8K9k2lkdP9DCm1HIgv1FAHD7Zph9Bh9ZtiIgCw4JYECgYEAosGbEqmzUvzt5L20\n0zvO6BMJ0TePQIycLl6JpViaid0o46KQ5Vy0DZVnxxo1OGgSm+xY5VaLkvMKKt1M\nm45PcRhnUvVgMpPhutH08n5CN3h4aUlXZ13KuPfeVjqAnulrCkPK/U2D4jwhBx+2\nZSXlpYdwB59EFCbF3PxDF00Oyds=\n-----END PRIVATE KEY-----\n",
	},
	databaseURL: "https://tanand-demo.firebaseio.com/"
});

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

	var time = request.body.time;

	singlePowerMeterObject = singlePowerMeter[0];
	triplePowerMeterObject = triplePowerMeter[0];
	temperatureSensorObject1 = temperatureSensor1[0];
	temperatureSensorObject2 = temperatureSensor2[0];

	singlePowerMeterObject.timestamp = time;
	triplePowerMeterObject.timestamp = time;
	temperatureSensorObject1.timestamp = time;
	temperatureSensorObject2.timestamp = time;

	var spm = _.pick(singlePowerMeterObject, 'mac', 'voltage', 'current', 'activepower', 'mainenergy', 'timestamp');
	var tpm = _.pick(triplePowerMeterObject, 'mac', 'voltage', 'voltage2', 'voltage3', 'current', 'current2', 'current3', 'activepower', 'activepower2', 'activepower3', 'mainenergy', 'mainenergy2', 'mainenergy3', 'timestamp');
	var ts1 = _.pick(temperatureSensorObject1, 'mac', 'temperature', 'humidity', 'BatteryVoltage', 'timestamp');
	var ts2 = _.pick(temperatureSensorObject2, 'mac', 'temperature', 'humidity', 'BatteryVoltage', 'timestamp');

	console.log('PRINT IT DAMN IT - SPM: ' + JSON.stringify(spm));
	console.log('PRINT IT DAMN IT - TPM: ' + JSON.stringify(tpm));
	console.log('PRINT IT DAMN IT - TS1: ' + JSON.stringify(ts1));
	console.log('PRINT IT DAMN IT - TS2: ' + JSON.stringify(ts2));

	db.single_power.create(spm).then(function(single_power) {
		response.status(200).send();
	}, function(e) {
		response.status(400).json(e);
	});

	db.triple_power.create(tpm).then(function(triple_power) {
		response.status(200).send();
	}, function(e) {
		response.status(400).json(e);
	});

	db.temp_humid.create(ts1).then(function(temp_humid) {
		response.status(200).send();
	}, function(e) {
		response.status(400).json(e);
	});

	db.temp_humid.create(ts2).then(function(temp_humid) {
		response.status(200).send();
	}, function(e) {
		response.status(400).json(e);
	});
});

// app.get('/get_singlephase_readings/:id', function(request, response) {
// 	db.single_power.findByAl

// 	response.json(single_power).send();
// });

app.use(express.static(__dirname + '/public'));

db.sequelize.sync({force: true}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});





