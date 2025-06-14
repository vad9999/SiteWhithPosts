const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Post = sequelize.define(
    "Post",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(400),
        allowNull: false,
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      themePostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "post",
      timestamps: true,
      paranoid: true,
    }
  );

  return Post;
};
