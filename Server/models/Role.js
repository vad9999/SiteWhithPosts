const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        }
    },
    {
    tableName: 'role',
    timestamps: true,
    paranoid: true
    })

    return Role
}