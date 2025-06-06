import { defineStore } from "pinia";
import api from '../api/api'
import Post from '../models/Post'
import { useUserStore } from "./useUserStore";
import { useThemePostStore } from "./useThemePostStore";

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [],
        userPosts: [],
        total: 0,        // общее число постов (для выбранной темы)
        page: 1,         // текущая страница
        limit: 10,       // сколько постов загружать за раз
        loading: false,  // флаг «идёт загрузка»
        themePostId: 0,  // текущая выбранная тема (0 = «все»)

        searchQuery: '',
        sortKey: 'date',         // 'date' | 'title' | 'username'
        sortDirection: 'desc'    // 'asc' | 'desc'
    }),
    actions: {
        async resetAndFetch(themeId) {
            this.themePostId = themeId;
            this.page = 1;
            this.posts = [];
            this.total = 0;
            this.loading = false;
            // Загружаем первую «страницу» постов:
            await this.loadMore();
        },
        async addPost(postData) {
            try {
                const res = await api.post('/posts', postData)
                return true
            } catch (e) {
                console.error('Ошибка добавления:', e)
                return false
            }
        },
        // async fetchPosts(themePostId) {
        //     try {
        //         const res = await api.get('/posts', { params: {themePostId}})
        //         this.posts = res.data.map(post => Post.fromJson(post))
        //         return true
        //     } catch (e) {
        //         console.error('Ошибка получения:', e)
        //         return false
        //     }
        // }
        // async fetchPosts(themePostId, page = 1, limit = 10) {
        //     try {
        //         const res = await api.get('/posts', {
        //             params: { themePostId, page, limit }
        //         })

        //         const userStore = useUserStore()
        //         const postsWithUsernames = await Promise.all(res.data.map(async (post) => {
        //             const user = await userStore.fetchUserById(post.userId)
        //             return {
        //                 ...Post.fromJson(post),
        //                 username: user.userName
        //             }
        //         }))

        //         // добавляем к текущим постам
        //         this.posts.push(...postsWithUsernames)

        //         // если пришло меньше лимита — больше постов нет
        //         return postsWithUsernames.length === limit
        //     } catch (e) {
        //         console.error('Ошибка получения:', e)
        //         return false
        //     }
        // },


        async fetchUserPosts(userId) {
            try {
                const res = await api.get(`/posts/userPost/${userId}`)
                const themePostStore = useThemePostStore()

                // Получаем username для каждого поста
                const postsWithThemes = await Promise.all(res.data.map(async (post) => {
                    const themePost = await themePostStore.fetchThemePostById(post.themePostId)
                    return {
                        ...Post.fromJson(post),
                        themePostName: themePost.name
                    }
                }))

                this.userPosts = postsWithThemes
                return true
            } catch (e) {
                console.error('Ошибка получения:', e)
                return false
            }
        },
        async fetchOnePost (postId) {
            const res = await api.get(`/posts/${postId}`)
            return res.data
        },


        async loadMore() {
            if (this.loading) return
            if (this.posts.length >= this.total && this.total !== 0) return

            this.loading = true
            try {
                const res = await api.get('/posts', {
                params: {
                    page: this.page,
                    limit: this.limit,
                    themePostId: this.themePostId
                },
                })

                const { posts: rawPosts, total } = res.data
                this.total = total

                // если мы на первой странице и rawPosts пустой — значит что-то не так
                if (this.page === 1 && rawPosts.length === 0) {
                    console.warn('ПЕРВАЯ СТРАНИЦА, НО ПУСТО')
                }

                const userStore = useUserStore()
                const postsWithUsernames = await Promise.all(
                    rawPosts.map(async (p) => {
                        const user = await userStore.fetchUserById(p.userId)
                        return {
                        ...Post.fromJson(p),
                        username: user.userName
                        }
                    })
                )

                this.posts.push(...postsWithUsernames)
                this.page += 1
            } catch (e) {
                console.error('Ошибка получения постов:', e)
            } finally {
                this.loading = false
            }
        }
    },
    getters: {
        filteredAndSortedPosts(state) {
            let result = [...state.posts];

            // Поиск
            if (state.searchQuery.trim()) {
            const query = state.searchQuery.trim().toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.body.toLowerCase().includes(query) ||
                post.username?.toLowerCase().includes(query)
            );
            }

            // Сортировка
            result.sort((a, b) => {
            let aVal = a[state.sortKey];
            let bVal = b[state.sortKey];

            if (state.sortKey === 'date' || state.sortKey === 'createdAt') {
                aVal = new Date(a.createdAt);
                bVal = new Date(b.createdAt);
            }

            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();

            if (aVal < bVal) return state.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return state.sortDirection === 'asc' ? 1 : -1;
            return 0;
            });

            return result;
        }
    }
})