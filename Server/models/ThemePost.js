const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const ThemePost = sequelize.define('ThemePost', {
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
    tableName: 'themePost',
    timestamps: true,
    paranoid: true
    })

    return ThemePost
}