import HttpRequest from './axios'
import Config from '../config'
const baseUrl =
  process.env.NODE_ENV === 'development' ?
  Config.baseUrl.dev:
  Config.baseUrl.pro

const axios = new HttpRequest(baseUrl)

export default axios