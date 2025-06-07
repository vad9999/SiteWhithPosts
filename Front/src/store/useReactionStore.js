import { defineStore } from 'pinia'
import api from '../api/api'
import { useUserStore } from './useUserStore';

export const useReactionStore = defineStore('reaction', {
	state: () => ({
		reactionsMap: {}
	}),
	actions: {
		async toggleReaction({ postId = null, commentId = null, type }) {
			const userStore = useUserStore()
			const userId = userStore.user.id
			const res = await api.post('/reactions/toggle', {
				userId,
				postId,
				commentId,
				type
			});

			const updated = res.data.reaction
			if (postId) {
				this.reactionsMap[postId] = updated
			}

			return updated
		},
		async fetchReactionsForPosts(postIds, userId) {
			try {
				const res = await api.post(`/reactions/posts`, {
				postIds,
				userId
				})

				// res.data должен быть объект: { [postId]: { likes, dislikes, userReaction } }
				this.reactionsMap = {
				...this.reactionsMap,
				...res.data
				}
			} catch (err) {
				console.error('Ошибка при загрузке реакций на посты:', err)
			}
		},
		getReactions(postId) {
			return this.reactionsMap[postId] || { likes: 0, dislikes: 0, userReaction: null }
		}
	}
});
