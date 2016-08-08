module.exports = function(sequelize, DataTypes) {
	return sequelize.define('notification', {
		alertId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			unique: true
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
			unique: false
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		},
		mac: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		}
	});
};