import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器：自動帶上 Access Token
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// 回應攔截器：Access Token 過期時自動換新的
api.interceptors.response.use(
  // 成功就直接回傳
  (response) => response,

  // 失敗時判斷是否需要 refresh
  async (error) => {
    const originalRequest = error.config

    // 如果是 401 且還沒 retry 過（避免無限迴圈）
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')

      // 沒有 refresh token，直接登出
      if (!refreshToken) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.push('/login')
        return Promise.reject(error)
      }

      try {
        // 用 refresh token 換新的 access token
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          refreshToken,
        })

        // 存新的 access token
        localStorage.setItem('accessToken', data.accessToken)

        // 用新的 token 重打原本失敗的 request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch {
        // refresh 也失敗（token 過期或被撤銷），強制登出
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.push('/login')
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default api
