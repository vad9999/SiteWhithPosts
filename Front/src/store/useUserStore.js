import { defineStore } from 'pinia'
import api from '../api'
import User from '../models/User'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        user: null
    }),
    actions: {
        async fetchUsers() {
            const res = await api.get('/users')
            this.users = res.data.map(user => User.fromJson(user))
        },
        async fetchUser(userId) {
            const res = await api.get(`/users/:${userId}`)
            this.user = res.data
        },
        async registerUser(userData) {
            const res = await api.post('/users', userData)
            this.user = res.data
        },
        async addUser(userData) {
            const res = await api.post('/users', userData)
            this.users.push(User.fromJson(res.data))
        },
        async deleteUser(userId) {
            await api.delete(`/users/:${userId}`)
            this.users = this.users.filter(user => user.id !== userId)
        },
        async updateUser(userId, data) {
            const response = await api.put(`/users/:${userId}`, data)
            const updated = User.fromJson(response.data)
            const index = this.users.findIndex(u => u.id === userId)
            if (index !== -1) this.users[index] = updated
        }
    }
})