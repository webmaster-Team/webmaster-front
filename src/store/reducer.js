import { combineReducers } from 'redux-immutable'
import { reducer as loginReducer } from '../pages/login/store'

export default combineReducers({
  login: loginReducer,
})
