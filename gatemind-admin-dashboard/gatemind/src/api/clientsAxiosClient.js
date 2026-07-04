import axios from 'axios'
import { APP_CONFIG } from '../config/app'

// All requests go through the Gateway (port 8080) which handles CORS and
// routes /api/v1/clients/** to the client-service internally.
const clientsAxiosClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,  // gateway: localhost:8080
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

clientsAxiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('gatemind_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

clientsAxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong while talking to the Client Management service.'
    return Promise.reject({ ...error, message })
  }
)

export default clientsAxiosClient
