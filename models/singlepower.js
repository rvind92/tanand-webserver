module.exports = function(sequelize, DataTypes) {
	return sequelize.define('singlepower', {
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
			type: DataTypes.DATE,
			allowNull: false,
			primaryKey: true
		},
		powerfactor: {
			type: DataTypes.FLOAT,
			allowNull: false
		}
	});
};