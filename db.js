var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if(env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: "postgres"
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-db.sqlite'
});
}
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-db.sqlite'
});

var db = {};

db.user = sequelize.import(__dirname + '/models/user.js');
db.location = sequelize.import(__dirname + '/models/location.js');
db.floorplan = sequelize.import(__dirname + '/models/floorplan.js');
db.single_power = sequelize.import(__dirname + '/models/single_power.js');
db.triple_power = sequelize.import(__dirname + '/models/triple_power.js');
db.temp_humid = sequelize.import(__dirname + '/models/temp_humid.js');
db.notification = sequelize.import(__dirname + '/models/notification.js');
db.command = sequelize.import(__dirname + '/models/command.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.location.belongsTo(db.user);
db.user.hasMany(db.location);

db.floorplan.belongsTo(db.location);
db.location.hasMany(db.floorplan);

module.exports = db;