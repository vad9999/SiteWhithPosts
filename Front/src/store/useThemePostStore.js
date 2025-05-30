import { defineStore } from 'pinia'
import api from '../api/api'
import ThemePost from '../models/ThemePost'

export const useThemePostStore = defineStore('themePost', {
    state: () => ({
        themePosts: [],
    }),
    actions: {
        async fetchThemePosts() {
            const res = await api.get('/themePosts')
            this.themePosts = res.data.map(themePost => ThemePost.fromJson(themePost))
        },
        async fetchThemePostById(themePostId) {
            const res = await api.get(`/themePosts/${themePostId}`)
            return res.data
        }
    }
})