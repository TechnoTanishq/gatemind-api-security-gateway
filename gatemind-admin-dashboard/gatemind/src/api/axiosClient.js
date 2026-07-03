import axios from 'axios'
import { APP_CONFIG } from '../config/app'

const axiosClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Placeholder for future JWT-based auth — reads a token if one is ever set.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('gatemind_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized place to normalize errors before they hit service files.
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong while talking to the GateMind API.'
    return Promise.reject({ ...error, message })
  }
)

export default axiosClient
