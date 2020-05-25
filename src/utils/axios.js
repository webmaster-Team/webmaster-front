// 封装axios的请求，返回重新封装的数据格式
// 对错误统一处理
import axios from 'axios'
import errorHandle from './errorHandle'
import Token from './token'
class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  //设定基础配置（不暴露）
  getInsideConfig() {
    let config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      timeout: 10000,
      withCredentials: true, //是否跨域请求带上凭证
    }
    // if (localStorage.getItem('token') !== null) {
    //   config.headers.Authorization = localStorage.getItem('token')
    // }
    return config
  }

  //设定拦截器（不暴露）
  interceptors(instance) {
    // 请求拦截器
    instance.interceptors.request.use(
      (config) => {
        config.headers.common['token'] = Token.get('token')
        // Do something before request is sent
        console.log('config ', config)
        return config
      },
      (err) => {
        errorHandle(err)
        return Promise.reject(err)
      }
    )
    // 响应请求的拦截器
    instance.interceptors.response.use(
      (res) => {
        console.log('res: ', res)
        if (res.status === 200) {
          return Promise.resolve(res.data)
        } else {
          return Promise.reject(res)
        }
      },
      (err) => {
        errorHandle(err)
        return Promise.reject(err)
      }
    )
  }

  //创建实例(不暴露)
  request (options) {
    const instance = axios.create()
    const newOptions = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance) //添加拦截器
    return instance(newOptions)
  }

  //暴露
  get(url, config) {
    const options = Object.assign(
      {
        method: 'get',
        url,
      },
      config
    )
    return this.request(options)
  }

  //暴露
  post(url, data, config) {
    return this.request({
      method: 'post',
      url,
      data,
    })
  }

  //暴露
  all(promises) {
    return axios.all(promises)
  }
}

export default HttpRequest
