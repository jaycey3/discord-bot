module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		jobs: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: true,
        },
	}, {
		timestamps: false,
	});
};