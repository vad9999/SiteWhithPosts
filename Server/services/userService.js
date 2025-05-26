const {User} = require('../models')

const getAllUsers = async () => {
    return await User.findAll()
}

const createUser = async (user) => {
    return await User.create(user)
}

const deleteUser = async (userId) => {
    const user = await User.findByPk(userId)
    if(!user) return null
    await user.destroy()
    return user
}

const updateUser = async (data, userId) => {
    const [updated] = await User.update(data, {where: {id: userId}})
    if(!updated) return null
    return User.findByPk(userId)
}

const getOneUser = async (userId) => {
    return await User.findByPk(userId)
}

const getUserAuth = async (login, password) => {
    return await User.findOne({ where: { login, password } })
}

module.exports = {
    getAllUsers,
    createUser,
    deleteUser,
    updateUser,
    getOneUser,
    getUserAuth
}