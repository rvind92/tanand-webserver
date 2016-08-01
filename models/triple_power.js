var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var triple_power = sequelize.define('triple_power', {
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
		ap2: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		ap3: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		current: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		current2: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		current3: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		volt: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		volt2: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		volt3: {
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