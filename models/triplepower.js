module.exports = function(sequelize, DataTypes) {
	return sequelize.define('triplepower', {
		mac: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		activepower: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		activepower2: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		activepower3: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		current: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		current2: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		current3: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		voltage: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		voltage2: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		voltage3: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		mainenergy: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		mainenergy2: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		mainenergy3: {
			type: DataTypes.FLOAT,
			allowNull: false,
			unique: false
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
			primaryKey: true
		},
		powerfactor: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
	});
};