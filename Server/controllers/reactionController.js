const reactionService = require('../services/reactionService');

const toggleReaction = async (req, res) => {
	const { userId, postId, commentId, type } = req.body;

	if (!userId || (!postId && !commentId) || !['like', 'dislike'].includes(type)) {
		return res.status(400).json({ error: 'Неверные параметры' });
	}

	try {
		const result = await reactionService.toggleReaction({ userId, postId, commentId, type });
		res.status(200).json({ reaction: result });
	} catch (e) {
		console.error('Ошибка при изменении реакции:', e);
		res.status(500).json({ error: 'Внутренняя ошибка сервера' });
	}
};

const getReactionsForPosts = async (req, res) => {
	try {
		const { postIds, userId } = req.body

		if (!Array.isArray(postIds) || typeof userId !== 'number') {
			return res.status(400).json({ message: 'Неверные данные' });
		}

		const data = await reactionService.getReactionsForPosts(postIds, userId)
		res.json(data)
	} catch (err) {
		console.error('Ошибка при получении реакций на посты:', err)
		res.status(500).json({ message: 'Ошибка сервера' })
	}
}

module.exports = {
  toggleReaction,
  getReactionsForPosts
};
