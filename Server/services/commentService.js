const Comment = require('../models/Comment')

const createComment =  async (comment) => {
    return await Comment.create(comment)
}

const getUserComment = async (userId) => {
    return await Comment.findAll({where: {userId: userId}})
}

const getPostComment = async (postId) => {
    return await Comment.findAll({where: {postId: postId}})
}

const deleteComment = async (commentId) => {
    const comment = await Comment.findByPk(commentId)
    await comment.destroy()
    return comment
}

const updateComment = async (data, commentId) => {
    await Comment.update(data, {where: {id: commentId}})
    return Comment.findByPk(commentId)
}

module.exports = {
    createComment,
    getUserComment,
    getPostComment,
    deleteComment,
    updateComment
}