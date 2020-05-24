import moment from 'moment'

//设置token存储到本地
const set = (value) => {
    localStorage.setItem("token", value)
    localStorage.setItem("expires", moment().add(1, 'days'))
}

//验证token是否过期
const validate = () => {
    // console.log(moment().get('millisecond'))
    return (
        typeof localStorage.getItem('token') !== 'undefined' &&
        localStorage.getItem('token') !== null &&
        moment().isBefore(localStorage.getItem('expires'))
    )
}

//获取token，如果token过期了，就返回一个空，否则将token如实返回
const get = () => {
    if (validate()) return localStorage.getItem("token")
    else return ""
}

export default {
    get,
    set,
    validate
}