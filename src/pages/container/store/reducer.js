import {
  fromJS
} from 'immutable'
import Moment from 'moment'
import * as constants from './constants'

const defaultState = fromJS({
  select: 'search', //表示当前选中的是哪一个选项
  login: false, //表示是否登录状态
  id: "",
  card: "",
  name: "",
  cover: "",
  email:'',
  sex:1,
  phone:'',
  identity: "学生",
  signTime:'',
  showAlert: false,
  message: '',
  messageType: 'success',
  isBorrowing: 0,
  hasBorrowed: 0,
  borrowingBooks:[],
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.CHANGE_SELECT:
      return state.set('select', action.select)
    case constants.MODIFY_LOGIN:
      return state.set('login', action.login)
    case constants.MODIFY_USER_INFO:
      return state.merge({
        "id": typeof action.info.id === "undefined" ? state.id : action.info.id,
        "card": typeof action.info.card === "undefined" ? state.card : action.info.card,
        "name": typeof action.info.name === "undefined" ? state.name : action.info.name,
        "cover": typeof action.info.cover === "undefined" ? state.cover : action.info.cover,
        "identity": typeof action.info.identity === "undefined" ? state.id : action.info.identity,
        "isBorrowing": typeof action.info.isBorrowing === "undefined" ? state.isBorrowing : action.info.isBorrowing,
        "hasBorrowed": typeof action.info.hasBorrowed === "undefined" ? state.hasBorrowed : action.info.hasBorrowed,
        "sex": typeof action.info.sex === "undefined" ? state.sex : action.info.sex,
        "email": typeof action.info.email === "undefined" ? state.email : action.info.email,
        "phone": typeof action.info.phone === "undefined" ? state.phone : action.info.phone,
        "signTime": typeof action.info.signTime === "undefined" ? state.signTime : Moment(action.info.signTime).format('YYYY-MM-DD'),
      })
    case constants.MODIFY_SHOW_ALERT:
      return state.merge({
        'showAlert': action.show,
        'message': action.message,
        'messageType': action.messageType
      })
    case constants.MODIFY_BORROWING_BOOKS:
      return state.set('borrowingBooks', action.borrowingBooks)
    default:
      return state
  }
}