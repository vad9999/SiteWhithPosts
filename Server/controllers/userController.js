const userService = require('../services/userService')

const getUsers = async(req, res) => {
    try {
        const users = await userService.getAllUsers()
        res.json(users)
    } catch(e) {
        console.log('Ошибка получения пользователей', e)
        res.status(503).json({ error: 'Ошибка получения пользователей' })
    }
} 

const addUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body)
        res.status(201).json(user)
    } catch(e) {
        console.log('Ошибка создания пользователя', e)
        res.status(503).json({ error: 'Ошибка создания пользователя' })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.body.userId)
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' })
        }
        res.status(200).json(user)
    } catch (e) {
        console.log('Ошибка удаления пользователя', e)
        res.status(503).json({ error: 'Ошибка удаления пользователя' })
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(req.body.data, req.body.userId)
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' })
        }
        res.status(200).json(user)
    } catch (e) {
        console.log('Ошибка обновления пользователя', e)
        res.status(503).json({ error: 'Ошибка обновления пользователя' })
    }
}


const getUser = async (req, res) => {
    try {
        const user = await userService.getOneUser(req.params.id)
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' })
        }
        res.status(200).json(user)
    } catch (e) {
        console.log('Ошибка получения пользователя', e)
        res.status(503).json({ error: 'Ошибка получения пользователя' })
    }
}


module.exports = {
    getUser,
    getUsers,
    deleteUser,
    addUser,
    updateUser
}