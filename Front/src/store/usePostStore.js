import { defineStore } from "pinia";
import api from "../api/api";
import Post from "../models/Post";
import { useUserStore } from "./useUserStore";
import { useThemePostStore } from "./useThemePostStore";
import { useReactionStore } from "./useReactionStore";

export const usePostStore = defineStore("post", {
  state: () => ({
    posts: [],
    userPosts: [],
    total: 0,
    page: 1,
    limit: 25,
    loading: false,
    themePostId: 0,

    searchQuery: "",
    sortKey: "date",
    sortDirection: "desc", // 'asc' | 'desc'
  }),
  actions: {
    async resetAndFetch(themeId) {
      this.themePostId = themeId;
      this.page = 1;
      this.posts = [];
      this.total = 0;

      await this.loadMore();
    },
    async addPost(postData) {
      try {
        const res = await api.post("/posts", postData);
        this.userPosts.push(res.data)
        return true;
      } catch (e) {
        console.error("Ошибка добавления:", e);
        return false;
      }
    },
    async fetchUserPosts(userId) {
      try {
        const res = await api.get(`/posts/userPost/${userId}`);
        const themePostStore = useThemePostStore();

        const postsWithThemes = await Promise.all(
          res.data.map(async (post) => {
            const themePost = await themePostStore.fetchThemePostById(
              post.themePostId
            );
            return {
              ...Post.fromJson(post),
              themePostName: themePost.name,
            };
          })
        );

        this.userPosts = postsWithThemes;

        const userStore = useUserStore();
        const reactionStore = useReactionStore();
        const postIds = this.posts.map((p) => p.id);
        await reactionStore.fetchReactionsForPosts(postIds, userStore.user.id);
        return true;
      } catch (e) {
        console.error("Ошибка получения:", e);
        return false;
      }
    },
    async fetchOnePost(postId) {
      const res = await api.get(`/posts/${postId}`);
      const userStore = useUserStore();

      const p = res.data;
      const user = await userStore.fetchUserById(p.userId);

      const reactionStore = useReactionStore();
      await reactionStore.fetchReactionsForPosts(p.id, userStore.user.id);

      return {
        ...Post.fromJson(p),
        username: user.userName,
      };
    },
    async loadMore() {
      if (this.loading) return;
      if (this.posts.length >= this.total && this.total !== 0) return;

      this.loading = true;
      try {
        const res = await api.get("/posts", {
          params: {
            page: this.page,
            limit: this.limit,
            themePostId: this.themePostId,
          },
        });

        const { posts: rawPosts, total } = res.data;
        this.total = total;

        if (this.page === 1 && rawPosts.length === 0) {
          console.warn("ПЕРВАЯ СТРАНИЦА, НО ПУСТО");
        }

        const userStore = useUserStore();
        const postsWithUsernames = await Promise.all(
          rawPosts.map(async (p) => {
            const user = await userStore.fetchUserById(p.userId);
            return {
              ...Post.fromJson(p),
              username: user.userName,
            };
          })
        );

        this.posts.push(...postsWithUsernames);
        this.page += 1;

        const reactionStore = useReactionStore();
        const postIds = this.posts.map((p) => p.id);
        await reactionStore.fetchReactionsForPosts(postIds, userStore.user.id);
      } catch (e) {
        console.error("Ошибка получения постов:", e);
      } finally {
        this.loading = false;
      }
    },
    async deletePost(postId) {
      try {
        const res = api.delete(`/posts/${postId}`);
        if (res) {
          return true;
        }
      } catch (e) {
        console.error(`Ошибка постов ${e}`);
        return false;
      }
    },
  },
  getters: {
    filteredAndSortedPosts(state) {
      const reactionStore = useReactionStore();
      let result = [...state.posts];

      if (state.searchQuery.trim()) {
        const query = state.searchQuery.trim().toLowerCase();
        result = result.filter(
          (post) =>
            post.title.toLowerCase().includes(query) ||
            post.body.toLowerCase().includes(query) ||
            post.username?.toLowerCase().includes(query)
        );
      }

      result.sort((a, b) => {
        let aVal, bVal;

        if (state.sortKey === "date" || state.sortKey === "createdAt") {
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
        } else if (state.sortKey === "likes" || state.sortKey === "dislikes") {
          aVal = reactionStore.getReactions(a.id)[state.sortKey];
          bVal = reactionStore.getReactions(b.id)[state.sortKey];
        } else {
          aVal = a[state.sortKey];
          bVal = b[state.sortKey];
        }

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return state.sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return state.sortDirection === "asc" ? 1 : -1;
        return 0;
      });

      return result;
    },
  },
});
