import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name || 'Usuario'
  },

  actions: {
    async register(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.register(credentials);
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Error al registrar';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.login(credentials);
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Error al iniciar sesión';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(profileData) {
      try {
        const { data } = await api.updateProfile(profileData);
        this.user = data.user;
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
      } catch (error) {
        throw error;
      }
    },

    async changePassword(passwords) {
      try {
        const { data } = await api.changePassword(passwords);
        return data;
      } catch (error) {
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});