import { defineStore } from 'pinia'
import api from '../api/api'
import Comment from '../models/Comment'

export const useCommentStore = defineStore('comment', {
    state: () => ({
        postComments: [],
    }),
    actions: {
        async fetchPostComments(postId) {
            const res = await api.get(`/comments/post/${postId}`)
            this.postComments = res.data.map(postComment => Comment.fromJson(postComment))
        },
        async addComment(commentData) {
            try {
                const res = await api.post('/comments', commentData)
                return true
            } catch (e) {
                console.error('Ошибка регистрации:', e)
                return false
            }
        },
    }
})