module.exports = (db) => {
  const { User, Post, ThemePost, Comment, Reaction } = db;

  ThemePost.hasOne(Post, { foreignKey: "themePostId" });
  Post.belongsTo(ThemePost, { foreignKey: "themePostId", onDelete: "CASCADE" });

  User.hasMany(Post, { foreignKey: "userId" });
  Post.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

  User.hasMany(Comment, { foreignKey: "userId" });
  Comment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

  Post.hasMany(Comment, { foreignKey: "postId" });
  Comment.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });

  User.hasMany(Reaction, { foreignKey: "userId" });
  Reaction.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

  Post.hasMany(Reaction, { foreignKey: "postId" });
  Reaction.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });

  Comment.hasMany(Reaction, { foreignKey: "commentId" });
  Reaction.belongsTo(Comment, { foreignKey: "commentId", onDelete: "CASCADE" });
};