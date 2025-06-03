const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	const Reaction = sequelize.define('Reaction', {
		id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		postId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		commentId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		type: {
			type: DataTypes.ENUM('like', 'dislike'),
			allowNull: false
		}
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['userId', 'postId']
			},
			{
				unique: true,
				fields: ['userId', 'commentId']
			}
		]
	},
	{
        tableName: 'reaction',
        timestamps: true,
        paranoid: true
	})

	return Reaction
}