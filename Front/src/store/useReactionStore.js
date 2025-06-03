import { defineStore } from 'pinia'
import api from '../api/api'
import { useUserStore } from './useUserStore';

export const useReactionStore = defineStore('reaction', {
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

      return res.data.reaction;
    }
  }
});
