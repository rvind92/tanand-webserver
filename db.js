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
db.singlepower = sequelize.import(__dirname + '/models/singlepower.js');
db.triplepower = sequelize.import(__dirname + '/models/triplepower.js');
db.temphumid = sequelize.import(__dirname + '/models/temphumid.js');
db.notification = sequelize.import(__dirname + '/models/notification.js');
db.command = sequelize.import(__dirname + '/models/command.js');
db.device = sequelize.import(__dirname + '/models/device.js');
db.token = sequelize.import(__dirname + '/models/token.js')
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.location.belongsTo(db.user);
db.user.hasMany(db.location);

db.floorplan.belongsTo(db.location);
db.location.hasMany(db.floorplan);

db.device.belongsTo(db.floorplan);
db.floorplan.hasMany(db.device);

db.temphumid.belongsTo(db.device);
db.device.hasMany(db.temphumid);
 
db.singlepower.belongsTo(db.device);
db.device.hasMany(db.singlepower);

db.triplepower.belongsTo(db.device);
db.device.hasMany(db.triplepower);

db.notification.belongsTo(db.device);
db.device.hasMany(db.notification);

db.command.belongsTo(db.device);
db.device.hasMany(db.command);

module.exports = db;