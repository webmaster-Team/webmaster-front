import HttpRequest from './axios'
import Config from '../config'
let baseUrl =
  process.env.NODE_ENV === 'development' ?
  Config.baseUrl.pro:
  Config.baseUrl.pro

const axios = new HttpRequest("")

export default axios