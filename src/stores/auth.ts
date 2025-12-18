import { defineStore } from 'pinia'
import api from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(credentials: any) {
      const response = await api.post('/login', credentials)
      this.token = response.data.token
      this.user = response.data.user
      if (this.token) {
        localStorage.setItem('token', this.token)
      }
    },

    async register(userData: any) {
      // 1. Enviamos todos los datos (nombre, email, password, etc.) a Laravel
      const { data } = await api.post('/register', userData)

      // 2. Laravel, si todo va bien, nos devuelve el usuario creado y su TOKEN
      this.token = data.token
      this.user = data.user

      // 3. Lo guardamos en el localstorage para que ya esté logueado
      localStorage.setItem('token', data.token)

      return data // Devolvemos los datos por si el componente necesita algo
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
