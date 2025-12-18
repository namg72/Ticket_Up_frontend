import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/login/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/login/RegisterView.vue'
import { setupGuards } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // Esta ruta debería estar protegida más adelante
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/Register',
      name: 'Register',
      component: RegisterView,
    },
  ],
})
setupGuards(router)

export default router
