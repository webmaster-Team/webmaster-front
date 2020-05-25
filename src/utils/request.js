import HttpRequest from './axios'
import config from '../config'
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? config.baseUrl.dev
    : config.baseUrl.pro
// 修改axios的header部分
console.log("axios的baseurl为"+baseUrl)
const axios = new HttpRequest(baseUrl)

export default axios
