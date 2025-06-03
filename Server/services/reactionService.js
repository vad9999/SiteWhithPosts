const { Reaction } = require('../models');

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

module.exports = {
  toggleReaction
};