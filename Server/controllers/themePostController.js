const themePostService = require('../services/themePostService')

const getThemePosts = async (req, res) => {
    try {
        const themePosts = await themePostService.getAllThemePosts()
        res.status(200).json(themePosts)
    } catch (e) {
        console.error('Ошибка получения тем постов:', e)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

const addThemePost = async (req, res) => {
    try {
        const themePost = await themePostService.createThemePost(req.body)
        res.status(201).json(themePost)
    } catch (e) {
        console.error('Ошибка создания тем постов:', e)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

const updateThemePost = async (req, res) => {
    try {
        const themePost = await themePostService.updateThemePost(req.body, req.params.id)
        if (!themePost) {
            return res.status(404).json({ error: 'Тема не найдена' })
        }
        res.status(200).json(themePost)
    } catch (e) {
        console.error('Ошибка обновления тем постов:', e)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

const deleteThemePost = async (req, res) => {
    try {
        const themePost = await themePostService.deleteThemePost(req.params.id)
        if (!themePost) {
            return res.status(404).json({ error: 'Тема не найдена' })
        }
        res.status(200).json(themePost)
    } catch (e) {
        console.error('Ошибка удаления тем постов:', e)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

const getThemePost = async (req, res) => {
    try {
        const themePost = await themePostService.getOneThemePost(req.params.id)
        if (!themePost) {
            return res.status(404).json({ error: 'Тема не найдена' })
        }
        res.status(200).json(themePost)
    } catch (e) {
        console.log('Ошибка получения темы', e)
        res.status(503).json({ error: 'Ошибка получения темы' })
    }
}

module.exports = {
    getThemePosts,
    addThemePost,
    updateThemePost,
    deleteThemePost,
    getThemePost
}
