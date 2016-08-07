module.exports = function(sequelize, DataTypes) {
	return sequelize.define('location', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		site: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		}
	});
};