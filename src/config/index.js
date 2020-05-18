let baseUrl = {
  dev: 'http://localhost:36742/',
  // dev: 'http://172.26.59.225:8082',
  pro: 'http://123.56.3.135:8080/',
}

export default {
  //axios配置
  baseUrl,
  fileUploadBaseUrl:
    process.env.NODE_ENV === 'development' ? baseUrl.dev : baseUrl.pro,
}
