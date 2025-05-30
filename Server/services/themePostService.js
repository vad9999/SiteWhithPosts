const { ThemePost } = require('../models')

const createThemePost = (themePost) => ThemePost.create(themePost)

const deleteThemePost = async (themePostId) => {
    const themePost = await ThemePost.findByPk(themePostId)
    if (!themePost) return null
    await themePost.destroy()
    return themePost
}

const updateThemePost = async (data, themePostId) => {
    const themePost = await ThemePost.findByPk(themePostId)
    if (!themePost) return null
    await themePost.update(data)
    return themePost
}

const getAllThemePosts = async() => {
    return await ThemePost.findAll()
}

const getOneThemePost = async (themePostId) => {
    return await ThemePost.findByPk(themePostId)
}

module.exports = {
    createThemePost,
    deleteThemePost,
    updateThemePost,
    getAllThemePosts,
    getOneThemePost
}