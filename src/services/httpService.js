import axios from 'axios'
import app from '../main'

let host = '://localhost'
let baseURL = 'http' + host + ':5000/work'

// let host = '://10.51.101.79'
// let baseURL = 'http' + host + ':5000/work'

// 正式部署地址
// let host = '118.24.112.95:8080/work'
// let baseURL = 'http' + host

axios.defaults.timeout = 1000 * 10
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = baseURL

// 请求拦截（配置发送请求的信息）
axios.interceptors.request.use((config) => {
  app.$Progress.start()
  // 处理请求之前的配置
  return config
}, (error) => {
  app.$Progress.fail()
  return Promise.reject(error)
})

axios.interceptors.response.use((res) => {
  app.$Progress.finish()
  return res
}, (err) => {
  if (err && err.response) {
    if (err.response.status === 401) {
      app.$Progress.finish()
      if ((window.location.href.indexOf('login') === -1) && (err.response.config.url.indexOf('ping') === -1)) {
        window.location.href = axios.defaults.baseURL + '/#/login'
      }
    } else {
      return Promise.reject(err)
    }
  }
})

export default {
  getHost: host,
  getAxios: axios,
  getBaseUrl: baseURL
}
