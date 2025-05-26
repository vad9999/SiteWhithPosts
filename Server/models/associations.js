module.exports = (db) => {
    const {User, Post, Role, Comment} = db

    Role.hasMany(User, { foreignKey: 'roleId'})
    User.belongsTo(Role, {foreignKey: 'roleId', onDelete: 'CASCADE'})

    User.hasMany(Post, {foreignKey: 'userId'})
    Post.belongsTo(User, {foreignKey: 'userId', onDelete: 'CASCADE'})

    User.hasMany(Comment, {foreignKey: 'userId'})
    Comment.belongsTo(User, {foreignKey: 'userId', onDelete: 'CASCADE'})

    Post.hasMany(Comment, {foreignKey: 'postId'})
    Comment.belongsTo(Post, {foreignKey: 'postId', onDelete: 'CASCADE'})
}