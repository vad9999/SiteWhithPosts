const { Reaction } = require('../models');
const { Op } = require('sequelize');

const toggleReaction = async ({ userId, postId, commentId, type }) => {
	const where = { userId };
	if (postId) where.postId = postId;
	if (commentId) where.commentId = commentId;

	const existing = await Reaction.findOne({ where });

	if (existing) {
		if (existing.type === type) {
		// Нажал ту же кнопку — удалить
		await existing.destroy();
		return null;
		} else {
		// Сменил тип — обновить
		await existing.destroy();
		}
	}

	return await Reaction.create({ userId, postId, commentId, type });
};

const getReactionsForPosts = async (postIds, userId) => {

  const reactions = await Reaction.findAll({
    where: {
      postId: {
        [Op.in]: postIds
      }
    }
  })

  const grouped = {}
  for (const postId of postIds) {
    const postReactions = reactions.filter(r => r.postId === postId)
    const likes = postReactions.filter(r => r.type === 'like').length
    const dislikes = postReactions.filter(r => r.type === 'dislike').length
    const userReactionObj = postReactions.find(r => r.userId === userId)
    grouped[postId] = {
      likes,
      dislikes,
      userReaction: userReactionObj ? userReactionObj.type : null
    }
  }

  return grouped
}
module.exports = {
  toggleReaction,
  getReactionsForPosts
};