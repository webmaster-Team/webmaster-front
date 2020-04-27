import { fromJS } from 'immutable'
import * as constants from './constants'

const defaultState = fromJS({
  login: false,
})

export default (state = defaultState, action) => {
  switch (action.type) {
    // case constants.CHANGE_LOGIN:
    //     return state.merge({
    //     		login:action.login,
    //     		account:action.account
    //     	    })
    case constants.CHANGE_LOGIN:
      return state.set('login', !state.get('login'))
    default:
      return state
  }
}
