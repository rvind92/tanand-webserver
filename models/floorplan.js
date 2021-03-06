module.exports = function(sequelize, DataTypes) {
	return sequelize.define('floorplan', {
		mac: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		floorplan: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		}
	});
};