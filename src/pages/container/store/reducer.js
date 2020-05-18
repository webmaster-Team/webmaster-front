import { fromJS } from 'immutable'
import * as constants from './constants'

const defaultState = fromJS({
  select:'',//表示当前选中的是哪一个选项
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.CHANGE_SELECT:
      return state.set('select', action.select)
    default:
      return state
  }
}
