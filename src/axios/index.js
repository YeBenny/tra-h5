import axios from 'axios'

axios.defaults.withCredentials = true

axios.defaults.baseURL = import.meta.env.BASE_URL

axios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (res) => {
    const data = res.data
    if (res.status === 200) {
      return Promise.resolve(data)
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)
