module.exports = function(sequelize, DataTypes) {
	return sequelize.define('single_power', {
		mac: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		voltage: {
			type: DataTypes.STRING,
			allowNull: false
		},
		current: {
			type: DataTypes.STRING,
			allowNull: false
		},
		activepower: {
			type: DataTypes.STRING,
			allowNull: false
		},
		mainenergy: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
};