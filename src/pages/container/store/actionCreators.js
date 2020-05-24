import * as constants from './constants'
import Axios from '../../../utils/request'

export const modifySelect = (select) => ({
  type: constants.CHANGE_SELECT,
  select,
})

export const modifyLogin = (login) => ({
  type: constants.MODIFY_LOGIN,
  login
})

export const modifyUserInfo = (info) => ({
  type: constants.MODIFY_USER_INFO,
  info
})

export const modifyShowAlert = (show, message, messageType) => ({
  type: constants.MODIFY_SHOW_ALERT,
  show,
  message,
  messageType
})