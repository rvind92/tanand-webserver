var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var command = sequelize.define('command', {
		deviceId: {
			type: DataTypes.STRING,
			allowNull: false,
			primary: true
		},
		command: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		}
	});
};