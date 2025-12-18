import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Importamos el store para el guard
import LoginView from '@/views/login/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/login/RegisterView.vue'
import MainLayout from '@/views/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true }, // Protegemos el layout y todos sus hijos
      children: [
        {
          path: '', // La ruta base del padre (/)
          name: 'home',
          component: HomeView,
        },
        // Aquí puedes añadir más hijos como /tickets, /profile, etc.
      ],
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

// --- CONFIGURACIÓN DEL GUARD INTEGRADO ---
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // 1. Recuperar sesión tras F5 (Hidratación)
  if (auth.token && !auth.user) {
    try {
      await auth.fetchUser()
    } catch (error) {
      // Si el token falló, limpiamos y mandamos al login
      auth.logout()
      return next('/login')
    }
  }

  // 2. Comprobar si la ruta requiere autenticación
  const isAuthRequired = to.matched.some((record) => record.meta.requiresAuth)

  if (isAuthRequired && !auth.token) {
    // Si no hay token y la ruta es protegida -> Login
    next('/login')
  } else if ((to.name === 'login' || to.name === 'Register') && auth.token) {
    // Si ya está logueado e intenta ir a login/registro -> Home
    next('/')
  } else {
    // En cualquier otro caso -> Adelante
    next()
  }
})

export default router
