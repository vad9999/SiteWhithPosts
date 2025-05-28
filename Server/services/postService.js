const { Post } = require('../models')


// const getAllPosts = (themePostId) => {
//     console.log(themePostId)
//     if(Number(themePostId) === 0 || themePostId === null || themePostId === undefined ) {
//         console.log('все')
//         return Post.findAll()
//     }
//     else {
//         console.log('по темам')
//         return Post.findAll({where: { themePostId }})
//     }
// }

const getAllPosts = (themePostId) => {
    const numericId = Number(themePostId)

    if (!themePostId || numericId === 0) {
        return Post.findAll()
    } else {
        return Post.findAll({ where: { themePostId: numericId } })
    }
}

const createPost = async (post) => {
    return await Post.create(post)
} 

const deletePost = async (postId) => {
    const post = await Post.findByPk(postId)
    if (!post) return null
    await post.destroy()
    return post
}

const updatePost = async (data, postId) => {
    const post = await Post.findByPk(postId)
    if (!post) return null
    await post.update(data)
    return post
}

const getOnePost = async (postId) => {
    return Post.findByPk(postId)
}

const getUserPost = async (userId) => {
    return Post.findAll({where: {userId : userId}})
}

module.exports = {
    getAllPosts,
    createPost,
    deletePost,
    updatePost,
    getOnePost,
    getUserPost
}