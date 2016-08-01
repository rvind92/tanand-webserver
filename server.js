var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
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

// app.post('/billion', function(request, response) {
// 	var body = _.pick(request.body, 'time');

// 	db.single_power.create(body).then(function(billion) {response.j})
// });

app.use(express.static(__dirname + '/public'));

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});





