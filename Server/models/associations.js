module.exports = (db) => {
    const {User, Post, Role, Comment} = db

    Role.hasMany(User, { foreignKey: 'roleId'})
    User.belongsTo(Role, {foreignKey: 'roleId'})

    User.hasMany(Post, {foreignKey: 'userId'})
    Post.belongsTo(User, {foreignKey: 'userId'})

    User.hasMany(Comment, {foreignKey: 'userId'})
    Comment.belongsTo(User, {foreignKey: 'userId'})

    Post.hasMany(Comment, {foreignKey: 'postId'})
    Comment.belongsTo(Post, {foreignKey: 'postId'})
}