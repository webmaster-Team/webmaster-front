import * as constants from './constants'
import Axios from '../../../utils/request'
import Token from '../../../utils/token'
export const tryLogin = (card, password) => {
  return (dispatch) => {
    Axios.post('/api/user/login', { card, password }).then((res) => {
      if (res.result) {
        let { id, card, name, cover, borrow, token } = res.data
        Token.set(token)
        dispatch(loginSuccess(id, card, name, cover, borrow, token))
      } else {
        dispatch(loginFailed())
      }
    })
  }
}

export const loginSuccess = (id, card, name, cover, borrow, token) => {
  return {
    type: constants.LOGIN_SUCCESS,
    id,
    card,
    name,
    cover,
    borrow,
    token,
  }
}

export const loginFailed = () => {
  return {
    type: constants.LOGIN_FAILED,
  }
}
