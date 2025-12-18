import type { Router } from 'vue-router'

export function setupGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/Register']
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = localStorage.getItem('token')

    if (authRequired && !loggedIn) {
      return next('/login')
    }

    // Evitar que un usuario ya logueado vuelva al Login
    if (loggedIn && to.path === '/login') {
      return next('/')
    }

    next()
  })
}
