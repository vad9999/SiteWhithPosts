import { defineStore } from "pinia";
import api from "../api/api";
import Comment from "../models/Comment";
import { useUserStore } from "./useUserStore";
import { useReactionStore } from "./useReactionStore";

export const useCommentStore = defineStore("comment", {
  state: () => ({
    postComments: [],
  }),
  actions: {
    async fetchPostComments(postId) {
      const res = await api.get(`/comments/post/${postId}`);
      const userStore = useUserStore();
      this.postComments = await Promise.all(
        res.data.map(async (c) => {
          const user = await userStore.fetchUserById(c.userId);
          return {
            ...Comment.fromJson(c),
            username: user.userName,
          };
        })
      );

      const reactionStore = useReactionStore();
      const commentIds = this.postComments.map((c) => c.id);
      await reactionStore.fetchReactionsForComments(
        commentIds,
        userStore.user.id
      );
    },
    async addComment(commentData) {
      try {
        const res = await api.post("/comments", commentData);
        return true;
      } catch (e) {
        console.error("Ошибка добавления:", e);
        return false;
      }
    },
    async deleteComment(commentId) {
      try {
        const res = api.delete(`/comments/${commentId}`);
        if (res) {
          return true;
        }
      } catch (e) {
        console.error(`Ошибка удаления комментрия, ${e}`);
        return false;
      }
    },
  },
});
