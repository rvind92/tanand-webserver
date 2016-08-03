module.exports = function(sequelize, DataTypes) {
	return sequelize.define('notification', {
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