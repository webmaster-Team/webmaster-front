let baseUrl = {
  dev: 'http://123.56.3.135:8080', //服务器的接口已经完成，可以直接调用
  pro: 'http://123.56.3.135:8080', //服务器
}


export default {
  //axios配置
  baseUrl,
  fileUploadBaseUrl: baseUrl.dev,
  captchaBaseUrl: baseUrl.dev,
}