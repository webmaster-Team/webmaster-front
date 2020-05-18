import { combineReducers } from 'redux-immutable'
import { reducer as loginReducer } from '../pages/login/store'
import { reducer as registerReducer } from '../pages/register/store'
import { reducer as borrowReducer } from '../pages/borrow/store'
import {reducer as frameReducer} from '../pages/container/store'
export default combineReducers({
  login: loginReducer,
  register: registerReducer,
  borrow: borrowReducer,
  frame:frameReducer
})
