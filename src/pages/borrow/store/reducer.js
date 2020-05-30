import { fromJS } from 'immutable'
import * as constants from './constants'

const defaultState = fromJS({
  bookData: [],//存储要借阅的书籍序号
  step: -1,
  borrowBook: [],
  borrowResultList:[],
  listData:[]//存储要借阅的书籍所有信息
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.COMMIT_BORROWED_BOOK_DATA:
      return state.set('bookData', action.bookData)
    case constants.COMMIT_TRUE_BORROWED_BOOK_DATA:
      return state.set('borrowBook', action.borrowBook)
    case constants.CHANGE_STEP:
      return state.set('step', action.step)
    case constants.MODIFY_LIST_DATA:
      return state.set('listData', action.listData)
    case constants.MODIFY_BORROW_RESULT_DATA:
      return state.set('borrowResultList', action.borrowResultData)
    default:
      return state
  }
}
