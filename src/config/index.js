let baseUrl = {
  dev: 'http://localhost:36742', //mock
  pro: 'http://123.56.3.135:8080', //服务器
  // pro:"http://localhost:3000"
}

let  studentBorrowDuration = 30
let  teacherBorrowDuration = 180

const getBorrowDuration = (identity) =>(identity === '学生'? studentBorrowDuration:teacherBorrowDuration)

export default {
  //axios配置
  baseUrl,
  fileUploadBaseUrl: baseUrl.pro,
  captchaBaseUrl: baseUrl.pro,
  getBorrowDuration
}