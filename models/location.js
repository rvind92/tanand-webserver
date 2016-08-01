var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var location = sequelize.define('location', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		locationId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		}
	});
};