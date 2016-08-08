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
			type: DataTypes.DATE,
			allowNull: false,
			primaryKey: true
		},
		powerfactor: {
			type: DataTypes.FLOAT,
			allowNull: false
		}
	});
	/*hooks: {
			beforeValidate: function(single_power, timestamp) {
				single_power.timestamp = moment.unix(single_power.timestamp).format("MM/DD/YYYY HH:mm:ss");
				console.log(single_power);
			}
		},*/
};