import axios from 'axios'
import { APP_CONFIG } from '../config/app'

// The Client Management service is a separate microservice from the
// analytics/gateway service, running on its own port — so it gets its
// own Axios instance rather than sharing axiosClient.js.
const clientsAxiosClient = axios.create({
  baseURL: APP_CONFIG.clientsApiBaseUrl,
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
