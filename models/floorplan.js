var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var floorplan = sequelize.define('floorplan', {
		devices: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		},
		floorplan: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		}
	});
};