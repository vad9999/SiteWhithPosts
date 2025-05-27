import { defineStore } from "pinia";
import api from '../api/api'
import Post from '../models/Post'

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [],
    }),
    actions: {
        async addPost(postData) {
            try {
                const res = await api.post('/posts', postData)
                this.posts.push(res.data)
                return true
            } catch (e) {
                console.error('Ошибка добавления:', e)
                return false
            }
        }
    }
})