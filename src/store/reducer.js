import { combineReducers } from 'redux-immutable'
import { reducer as loginReducer } from '../pages/login/store'
import { reducer as registerReducer } from '../pages/register/store'
export default combineReducers({
  login: loginReducer,
  register: registerReducer,
})
