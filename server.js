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

	var requestBody = request.body;
	var time = moment.unix(requestBody.time).format("YYYY-MM-DD HH:mm:ss.SSS");
	var billion = _.pick(requestBody, 'mac', 'model', 'wanip');
	billion.timestamp = time;

	db.device.create(billion).then(function(device) {
		response.status(200).send();
	});
	
	var singlePowerMeter = _.where(requestBody.devices, {
		model: "SG3010-T2"
	});

	var triplePowerMeter = _.where(requestBody.devices, {
		model: "SG3030"
	});

	var temperatureSensor1 = _.where(requestBody.devices, {
		model: "SG110-A"
	});

	var temperatureSensor2 = _.where(requestBody.devices, {
		model: "SG110-TSA"
	});

	singlePowerMeterObject = singlePowerMeter[0];
	triplePowerMeterObject = triplePowerMeter[0];
	temperatureSensorObject1 = temperatureSensor1[0];
	temperatureSensorObject2 = temperatureSensor2[0];
	
	if(singlePowerMeterObject) {
		singlePowerMeterObject.timestamp = time;
		var spm = _.pick(singlePowerMeterObject, 'mac', 'voltage', 'current', 'activepower', 'mainenergy', 'timestamp','powerfactor','status');
		var spmID = spm.mac;

		db.singlepower.create(spm).then(function(single_power) {
			var db = firebase.database();
			var ref = db.ref('readingPowerList').child("iskl").child(spmID);
			ref.update({
				activepower: parseFloat(spm.activepower),
				current:parseFloat(spm.current),
				mainenergy: parseFloat(spm.mainenergy),
				powerfactor: parseFloat(spm.powerfactor),
				voltage:parseFloat(spm.voltage),
				status:parseInt(spm.status)
			});

			return single_power;
			response.status(200).send();
		}, function(e) {
			response.status(400).json(e);
		}).then(function(single_power_instance) {
			db.device.findById(billion.mac).then(function(billionDevice) {
				single_power_instance.setDevice(billionDevice);
			});
		});
	}

	if(triplePowerMeterObject) {
		triplePowerMeterObject.timestamp = time;
		var tpm = _.pick(triplePowerMeterObject, 'mac', 'voltage', 'voltage2', 'voltage3', 'current', 'current2', 'current3', 'activepower', 'activepower2', 'activepower3', 'mainenergy', 'mainenergy2', 'mainenergy3', 'timestamp','powerfactor', 'powerfactor2', 'powerfactor3', 'status');
		var tpmID = tpm.mac;

		db.triplepower.create(tpm).then(function(triple_power) {
			var db = firebase.database();
			var ref = db.ref('readingPowerList').child("iskl").child(tpmID);
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
			// 	status:parseInt(tpm.status)
			// });

			return triple_power;
			response.status(200).send();
		}, function(e) {
			response.status(400).json(e);
		}).then(function(triple_power_instance) {
			db.device.findById(billion.mac).then(function(billionDevice) {
				triple_power_instance.setDevice(billionDevice);
			});
		});
	}

	if(temperatureSensorObject1) {
		temperatureSensorObject1.timestamp = time;
		var ts1 = _.pick(temperatureSensorObject1, 'mac', 'temperature', 'humidity', 'BatteryVoltage', 'timestamp');
		var ts1ID = ts1.mac;

		db.temphumid.create(ts1).then(function(temp_humid1) {
			var db = firebase.database();
			var ref = db.ref('readingTempList').child("iskl").child(ts1ID);
			ref.update({
				humidity: parseFloat(ts1.humidity),
				temperature:parseFloat(ts1.temperature),
			});

			return temp_humid1;
			response.status(200).send();
		}, function(e) {
			response.status(400).json(e);
		}).then(function(temphumid1_instance) {
			db.device.findById(billion.mac).then(function(billionDevice) {
				temphumid1_instance.setDevice(billionDevice);
			});
		});
	}

	if(temperatureSensorObject2) {
		temperatureSensorObject2.timestamp = time;
		var ts2 = _.pick(temperatureSensorObject2, 'mac', 'temperature', 'humidity', 'BatteryVoltage', 'timestamp');
		var ts2ID = ts2.mac;

		db.temphumid.create(ts2).then(function(temp_humid2) {
			var db = firebase.database();
			var ref = db.ref('readingTempList').child("iskl").child(ts2ID);
			// ref.update({
			// 	humidity: parseFloat(ts2.humidity),
			// 	temperature:parseFloat(ts2.temperature),
			// });

			return temp_humid2;
			response.status(200).send();
		}, function(e) {
			response.status(400).json(e);
		}).then(function(temphumid2_instance) {
			db.device.findById(billion.mac).then(function(billionDevice) {
				temphumid2_instance.setDevice(billionDevice);
			});
		});
	}

});

app.get('/trending/:mac', function(request, response) {

	function createChart_SINGLEPOWER(params) {
		var chartData = {};
		var json, arrays, time, spobject, spm;
		var volt = []; var curr = []; var ap = [];
		var voltdata = []; var currdata = []; var apdata = [];

		db.device.findAll({
			include: [{ 
				model: db.singlepower, 
				where: {
					mac : params
				},
				required: true 
			}]
		}).then(function(devices) {
			devices.forEach(function(devices) {
				json = devices.toJSON();
				arrays = json.singlepowers;

				for(var i = 0; i < arrays.length; i++) {
					time = moment(json.singlepowers[i].timestamp).unix();
					spobject = json.singlepowers[i];
					spobject.timestamp = time;
					spm = _.pick(spobject, 'voltage', 'current', 'activepower', 'timestamp');

					voltdata.push({
						"x": spm.timestamp,
						"y": spm.voltage
					});
					currdata.push({
						"x": spm.timestamp,
						"y": spm.current
					});
					apdata.push({
						"x": spm.timestamp,
						"y": spm.activepower
					});
				}
				volt.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : voltdata
				});
				curr.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : currdata
				})
				ap.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : apdata
				})
			});
			chartData.volt = volt;
			chartData.current = curr;
			chartData.activepower = ap;
			response.json(chartData);
		});
	}

	function createChart_TRIPLEPOWER(params){
		var chartData = {};
		var json, arrays, time, spobject, spm;
		var volt = []; var volt2 = []; var volt3 = [];
		var curr = []; var curr2 = []; var curr3 = [];
		var ap = []; var ap2 = []; var ap3 = [];
		var voltdata = []; var volt2data = []; var volt3data = [];
		var currdata = []; var curr2data = []; var curr3data = [];
		var apdata = []; var ap2data = []; var ap3data = []

		db.device.findAll({ 
			include: [{ 
				model: db.triplepower, 
				where: {
					mac : params
				}, 
				required: true 
			}]
		}).then(function(devices) {
			devices.forEach(function(devices) {
				json = devices.toJSON();
				arrays = json.triplepowers;

				for(var i = 0; i < arrays.length; i++) {
					time = moment(json.triplepowers[i].timestamp).unix();
					tpobject = json.triplepowers[i];
					tpobject.timestamp = time;
					tpm = _.pick(spobject, 'voltage', 'voltage2', 'voltage3', 'current', 'current2', 'current3', 'activepower', 'activepower2', 'activepower3', 'timestamp');

					voltdata.push({
						"x": tpm.timestamp,
						"y": tpm.voltage
					});
					volt2data.push({
						"x": tpm.timestamp,
						"y": tpm.voltage2
					});
					volt3data.push({
						"x": tpm.timestamp,
						"y": tpm.voltage3
					});
					currdata.push({
						"x": tpm.timestamp,
						"y": tpm.current
					});
					curr2data.push({
						"x": tpm.timestamp,
						"y": tpm.current2
					});
					curr3data.push({
						"x": tpm.timestamp,
						"y": tpm.current3
					})
					apdata.push({
						"x": tpm.timestamp,
						"y": tpm.activepower
					});
					ap2data.push({
						"x": tpm.timestamp,
						"y": tpm.activepower2
					});
					ap3data.push({
						"x": tpm.timestamp,
						"y": tpm.activepower3
					})
				}
				volt.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : voltdata
				});
				volt2.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : volt2data
				});
				volt3.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : volt3data
				});
				curr.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : currdata
				});
				curr2.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : curr2data
				});
				curr3.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : curr3data
				});
				ap.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : apdata
				})
				ap2.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : ap2data
				})
				ap3.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : ap3data
				})
			});
			chartData.volt = volt; chartData.volt2 = volt2; chartData.volt3 = volt3;
			chartData.current = curr; chartData.current2 = curr2; chartData.current3 = curr3;
			chartData.activepower = ap; chartData.activepower2 = ap2; chartData.activepower3 = ap3;
					//console.log(JSON.stringify(chartData, null, 2));
					response.json(chartData);
				});
	}

	function createChart_TEMPHUMID(params) {
		var chartData = {};
		var json, arrays, time, spobject, spm;
		var temp = []; var humid = []; var batteryvolt = [];
		var tempdata = []; var humiddata = []; var batteryvoltdata = [];

		db.device.findAll({
			include: [{
				model: db.temphumid,
				where: {
					mac : params
				},
				required: true
			}]
		}).then(function(devices){
			devices.forEach(function(devices){
				json = devices.toJSON();
				arrays = json.temphumids;

				for(var i = 0; i < arrays.length; i++) {
					time = moment(json.temphumids[i].timestamp).unix();
					tempobject = json.temphumids[i];
					tempobject.timestamp = time;
					ts = _.pick(tempobject, 'temperature', 'humidity', 'BatteryVoltage', 'timestamp');

					tempdata.push({
						"x": ts.timestamp,
						"y": ts.temperature
					});
					humiddata.push({
						"x": ts.timestamp,
						"y": ts.humidity
					});
					batteryvoltdata.push({
						"x": ts.timestamp,
						"y": ts.BatteryVoltage
					});
				}
				temp.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : tempdata
				});
				humid.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : humiddata
				});
				batteryvolt.push({
					"mac" : json.mac,
					"name": json.name,
					"data" : batteryvoltdata
				});
			});
			chartData.temperature = temp;
			chartData.humidity = humid;
			chartData.batteryVoltage = batteryvolt;
			console.log(JSON.stringify(chartData, null, 2));
			response.json(chartData);
		});
	}

	var params = request.params.mac; //retrieve URL parameters from request

	db.device.findAll({
		where: {
			mac: params
		}
	}).then(function(deviceFound) {
		console.log(JSON.stringify(deviceFound));
		createChart_SINGLEPOWER();
		// if(deviceMac.type === "single power") {
		// 	createChart_SINGLEPOWER(deviceMac.mac);
		// } else if (deviceMac.type === "triple power") {
		// 	createChart_TRIPLEPOWER(deviceMac.mac);
		// } else {
		// 	createChart_TEMPHUMID(deviceMac.mac);
		// }
	}, function(e) {
		response.status(400).json(e);
	});
});

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

db.sequelize.sync({
	force: true
}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});



