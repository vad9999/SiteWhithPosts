module.exports = (db) => {
    const {User, Post, ThemePost, Comment} = db

    ThemePost.hasOne(Post, { foreignKey: 'themePostId'})
    Post.belongsTo(ThemePost, {foreignKey: 'themePostId', onDelete: 'CASCADE'})

    User.hasMany(Post, {foreignKey: 'userId'})
    Post.belongsTo(User, {foreignKey: 'userId', onDelete: 'CASCADE'})

    User.hasMany(Comment, {foreignKey: 'userId'})
    Comment.belongsTo(User, {foreignKey: 'userId', onDelete: 'CASCADE'})

    Post.hasMany(Comment, {foreignKey: 'postId'})
    Comment.belongsTo(Post, {foreignKey: 'postId', onDelete: 'CASCADE'})
}