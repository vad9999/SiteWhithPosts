const Post = require('../models/Post')

const getAllPosts = async () => {
    return await Post.findAll()
}

const createPost = async (post) => {
    return await Post.create(post)
} 

const deletePost = async (postId) => {
    const post = await Post.findByPk(postId)
    await post.destroy()
    return post
}

const updatePost = async (data, postId) => {
    await Post.update(data, {where: {id: postId}})
    return Post.findByPk(postId)
}

const getOnePost = async (postId) => {
    return await Post.findOne(postId)
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