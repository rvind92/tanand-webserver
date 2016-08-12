module.exports = function(sequelize, DataTypes) {
	return sequelize.define('temphumid', {
		mac: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		temperature: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		humidity: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		BatteryVoltage: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
			primaryKey: true
		}
	});
};