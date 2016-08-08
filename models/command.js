module.exports = function(sequelize, DataTypes) {
	return sequelize.define('command', {
		mac: {
			type: DataTypes.STRING,
			allowNull: false,
			primary: true
		},
		command: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		}
	});
};