import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/api', // Ajusta a la URL de tu Laravel
})

// Esto adjunta el token automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 2. INTERCEPTOR DE RESPUESTA
api.interceptors.response.use(
  (response) => response, // Si la respuesta es OK (200), no hacemos nada
  (error) => {
    // Si el servidor responde 401 (No autorizado)
    if (error.response && error.response.status === 401) {
      console.warn('Token expirado o inválido. Redirigiendo al login...')

      // Limpiamos el token para que el Router Guard no nos deje entrar
      localStorage.removeItem('token')

      // Redirigimos al usuario al login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
