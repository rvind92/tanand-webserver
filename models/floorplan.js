module.exports = function(sequelize, DataTypes) {
	return sequelize.define('floorplan', {
		devices: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		},
		floorplan: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		}
	});
};