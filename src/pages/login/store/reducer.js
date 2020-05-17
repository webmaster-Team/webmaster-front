import { fromJS } from 'immutable'
import * as constants from './constants'

const defaultState = fromJS({
  login: false,
  id: '',
  name: '',
  cover: '',
  card: '',
  msg: '',
  borrow: 0,
  tryTimes: 0,
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.LOGIN_SUCCESS:
      return state.merge({
        login: true,
        id: action.id,
        name: action.name,
        card: action.card,
        cover: action.cover,
        borrow: parseInt(action.borrow),
        tryTimes: state.get('tryTimes') + 1,
      })
    case constants.LOGIN_FAILED:
      return state.merge({
        login: false,
        msg: action.msg,
        tryTimes: state.get('tryTimes') + 1,
      })
    default:
      return state
  }
}
