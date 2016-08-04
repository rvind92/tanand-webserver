module.exports = function(sequelize, DataTypes) {
	return sequelize.define('single_power', {
		mac: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		voltage: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		current: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		activepower: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		mainenergy: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		timestamp: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true
		}
	});
};