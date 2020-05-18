import { fromJS } from 'immutable'
import * as constants from './constants'

const defaultState = fromJS({
  id: '',
  name: '',
  cover: '',
  card: '',
  msg: '',
  borrow: 0,
  tryTimes: 0,
  token: '',
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.LOGIN_SUCCESS:
      return state.merge({
        id: action.id,
        name: action.name,
        card: action.card,
        cover: action.cover,
        borrow: parseInt(action.borrow),
        tryTimes: state.get('tryTimes') + 1,
        token: action.token,
      })
    case constants.LOGIN_FAILED:
      return state.merge({
        msg: action.msg,
        tryTimes: state.get('tryTimes') + 1,
      })
    default:
      return state
  }
}
