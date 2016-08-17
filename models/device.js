module.exports = function(sequelize, DataTypes) {
	return sequelize.define('devices', {
		mac: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		wanip: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
			primaryKey: true
		},
		model: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
};