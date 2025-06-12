import { defineStore } from "pinia";
import api from "../api/api";
import User from "../models/User";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    user: null,
  }),
  actions: {
    async fetchUsers() {
      const res = await api.get("/users");
      this.users = res.data.map((user) => User.fromJson(user));
    },
    async fetchUserById(userId) {
      const res = await api.get(`/users/${userId}`);
      return res.data;
    },
    async addUser(userData) {
      try {
        const res = await api.post("/users", userData);
        this.user = res.data;
        return true;
      } catch (e) {
        console.error("Ошибка регистрации:", e);
        return false;
      }
    },
    async deleteUser(userId) {
      try {
        const res = await api.delete(`/users/${userId}`);
        return true;
      } catch (e) {
        console.error("Ошибка удаления аккаунта:", e);
        return false;
      }
    },
    async updateUser(userId, data) {
      console.log(userId);
      const response = await api.put(`/users/${userId}`, data);
      const updated = User.fromJson(response.data);
      if (updated) {
        this.user = updated;
        return true;
      } else {
        return false;
      }
    },
    async fetchUserAuth(login, password) {
      try {
        const res = await api.post(`/users/auth`, { login, password });
        this.user = res.data;
        return true;
      } catch (e) {
        console.error("Ошибка авторизации:", e);
        return false;
      }
    },
    logout() {
      this.user = null;
    },
  },
  persist: true,
});
