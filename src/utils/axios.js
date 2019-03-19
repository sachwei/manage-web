import axios from 'axios'

// axios 配置
axios.defaults.timeout = 1000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = 'http://localhost:4000'

// 请求拦截（配置发送请求的信息）
axios.interceptors.request.use((config) => {
  // 处理请求之前的配置
  return config
}, (error) => {
  // 请求失败的处理
  return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use(
  response => {
    if (response.data && response.data.code) {
      if (response.data.code === '2001') {
        // 退出登录
      }
    }
    return response
  },
  error => {
    if (error.response) {
      // 全局ajax错误信息提示
      // MessageBox({type: 'error', message: error.response.data, title: '温馨提示'})
    }
    return Promise.reject(error)
  }
)

export default axios
