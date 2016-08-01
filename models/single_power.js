var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var single_power = sequelize.define('single_power', {
		deviceId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		ap: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		current: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		volt: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		powerFactor: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		mainEnergy: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		}
	});
};