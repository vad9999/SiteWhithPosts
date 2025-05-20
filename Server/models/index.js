const {Sequelize} = require('sequelize')
const path = require('path')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../base.sqlite'),
    logging: false
})

const User = require('./User')(sequelize)
const Post = require('./Post')(sequelize)
const Role = require('./Role')(sequelize)
const Comment = require('./Comment')(sequelize)

const db = {
    sequelize,
    User,
    Post,
    Role,
    Comment
}

module.exports = db