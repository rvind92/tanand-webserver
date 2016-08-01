var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var notification = sequelize.define('notification', {
		alertId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			unique: true
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		},
		device: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		}
	});
};