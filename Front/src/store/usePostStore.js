import { defineStore } from "pinia";
import api from '../api/api'
import Post from '../models/Post'
import { useUserStore } from "./useUserStore";
import { useThemePostStore } from "./useThemePostStore";

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [],
        userPosts: []
    }),
    actions: {
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
        async fetchPosts(themePostId) {
            try {
                const res = await api.get('/posts', { params: { themePostId } })
                const userStore = useUserStore()

                // Получаем username для каждого поста
                const postsWithUsernames = await Promise.all(res.data.map(async (post) => {
                    const user = await userStore.fetchUserById(post.userId)
                    return {
                        ...Post.fromJson(post),
                        username: user.userName
                    }
                }))

                this.posts = postsWithUsernames
                return true
            } catch (e) {
                console.error('Ошибка получения:', e)
                return false
            }
        },
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
        }
    }
})