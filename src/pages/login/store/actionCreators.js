import * as constants from './constants'
import Axios from '../../../utils/request'

export const tryLogin = (card, password) => {
  return (dispatch) => {
    Axios.post('/api/user/login', { card, password }).then((res) => {
      if (res.result) {
        let { id, card, name, cover } = res.data
        dispatch(loginSuccess(id, card, name, cover))
      } else {
        dispatch(loginFailed())
      }
    })
  }
}

export const loginSuccess = (id, card, name, cover) => {
  return {
    type: constants.LOGIN_SUCCESS,
    id,
    card,
    name,
    cover,
  }
}

export const loginFailed = () => {
  return {
    type: constants.LOGIN_FAILED,
  }
}
