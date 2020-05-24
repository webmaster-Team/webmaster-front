let baseUrl = {
  dev: 'http://localhost:36742/',
  // dev: 'http://172.26.51.237:8080',
  // dev: 'http://192.168.43.111:8080',
  // dev: 'http://123.56.3.135:8080',
  pro: 'http://123.56.3.135:8080', //服务器
}

export default {
  //axios配置
  baseUrl,
  fileUploadBaseUrl: baseUrl.dev,
  // process.env.NODE_ENV === 'development' ? baseUrl.dev : baseUrl.pro,
  captchaBaseUrl: baseUrl.dev,
  // process.env.NODE_ENV === 'development' ? "123.56.3.135:8080/" : "http://172.26.51.186:8082"
}