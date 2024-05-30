import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000,
  withCredentials: true,
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // 添加时间戳
    config.params = {
      ...config.params,
      timestamp: new Date().getTime(),
    }
    return config
  }, err => {
    // 请求错误
    ElMessage({
      type: 'error',
      message: err.response.message || '未知错误',
    })
    return Promise.resolve(err)
  },
)

// 响应拦截器
request.interceptors.response.use(
  data => {
    if (data.data.code === 400) {
      ElMessage({
        type: 'error',
        message: data.data.message || data.data.msg || '未知错误',
      })

      return Promise.reject(data.data)
    }
    return Promise.resolve(data.data)
  }, err => {
    console.error(err)
    ElMessage({
      type: 'error',
      message: err.message || '未知错误',
    })
    return Promise.reject(err)
  },
)

export default request
