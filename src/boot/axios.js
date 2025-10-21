import axios from 'axios'

// Detecta si estás en desarrollo o producción
const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'https://localhost:7225/api' // localhost para pruebas
    : 'https://lavanderiaburbuclean.somee.com/api' // producción en Somee

// Configura instancia
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
