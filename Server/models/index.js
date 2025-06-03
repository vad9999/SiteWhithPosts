const { Sequelize } = require('sequelize')
const path = require('path')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../base.sqlite'),
    logging: false
})

const ThemePost = require('./ThemePost')(sequelize)
const User = require('./User')(sequelize)
const Post = require('./Post')(sequelize)
const Comment = require('./Comment')(sequelize)
const Reaction = require('./Reaction')(sequelize)

const db = {
    sequelize,
    ThemePost,
    User,
    Post,
    Comment,
    Reaction
}

module.exports = db