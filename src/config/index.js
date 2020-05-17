let baseUrl = {
  dev: 'http://localhost:36742/',
  pro: 'http://123.56.3.135:8080/',
}

export default {
  //axios配置
  baseUrl,
  fileUploadBaseUrl:
    process.env.NODE_ENV === 'development' ? baseUrl.dev : baseUrl.pro,
}
