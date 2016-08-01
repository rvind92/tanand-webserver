var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var temp_humid = sequelize.define('temp_humid', {
		deviceId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			unique: true
		},
		temperature: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: false
		},
		humidity: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		battery: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		}
	});
};