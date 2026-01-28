import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_APP_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.VITE_BACKEND_APP_KEY,
  },
})

export default apiClient
