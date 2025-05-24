const Comment = require('../models/Comment')

const createComment = (comment) => {
    return Comment.create(comment)
}

const getUserComment = (userId) => {
    return Comment.findAll({ where: { userId } })
}

const getPostComment = (postId) => {
    return Comment.findAll({ where: { postId } })
}

const deleteComment = async (commentId) => {
    const comment = await Comment.findByPk(commentId)
    if (!comment) return null
    await comment.destroy()
    return comment
}


const updateComment = async (data, commentId) => {
    const comment = await Comment.findByPk(commentId)
    if (!comment) return null
    await comment.update(data)
    return comment
}


module.exports = {
    createComment,
    getUserComment,
    getPostComment,
    deleteComment,
    updateComment
}