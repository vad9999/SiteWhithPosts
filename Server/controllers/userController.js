const userService = require('../services/userService')

const getUsers = async(req, res) => {
    try {
        const users = await userService.getAllUsers()
        res.json(users)
    } catch(e) {
        console.log('Ошибка получения пользователей', e)
        res.status(503)
    }
} 

const addUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body)
        res.status(201).json(user)
    } catch(e) {
        console.log('Ошибка создания пользователя', e)
        res.status(503)
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.body)
        if(user === null) {
            console.log('Пользователь с таким id не найден', e)
            res.status(503)
        }
        else {
            res.status(201).json(user)
        }
    } catch(e) {
        console.log('Ошибка удаления пользователя', e)
        res.status(503)
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(req.body.data, req.body.userId)
        if(user === null) {
            console.log('Пользователь с таким id не найден', e)
            res.status(503)
        }
        else {
            res.status(201).json(user)
        }
    } catch(e) {
        console.log('Ошибка обновления пользователя', e)
        res.status(503)
    }
}

const getUser = async (req, res) => {
    try {
        const user = await userService.getOneUser(req.body)
        res.status(201).json(user)
    } catch(e) {
        console.log('Ошибка получения пользователя', e)
        res.status(503)
    }    
}

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    addUser,
    updateUser
}