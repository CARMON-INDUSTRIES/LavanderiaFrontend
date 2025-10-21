import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Detectar si estamos en local o producción
const baseURL =
  window.location.hostname === 'localhost'
    ? 'https://localhost:7255/api'
    : 'https://lavanderiaburbuclean.somee.com/api'

const api = axios.create({
  baseURL, // se ajusta automáticamente según el entorno
})

// Interceptor para agregar token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }
