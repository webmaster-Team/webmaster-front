import * as constants from './constants'
import Axios from '../../../utils/request'

export const removeFile = (file) => ({
  type: constants.REMOVE_FILE,
  file,
})

export const addFile = (file) => ({
  type: constants.ADD_FILE,
  file,
})

export const tryRegister = (data) => {
  return (dispatch) => {
    const reqData = {
      card: data.card,
      email: data.email,
      name: data.name,
      password: data.password,
      phone: data.phone,
      sex: parseInt(data.sex),
      cover: data.avatarUrl,
    }
    Axios.post('/api/user/register', reqData).then((res) => {
      console.log(res)
      if (res.result === 1) {
        dispatch(register(true))
      } else {
        dispatch(register(false))
      }
    })
  }
}

export const register = (data) => ({
  type: constants.REGISTER,
  register: data,
})
