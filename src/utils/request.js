import HttpRequest from './axios'
import config from '../config'
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? config.baseUrl.dev
    : config.baseUrl.pro
//输出当前axios的头部
console.log("axios的baseurl为"+baseUrl)
const axios = new HttpRequest(baseUrl)

export default axios
