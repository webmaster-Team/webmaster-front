import { fromJS } from 'immutable'
import * as constants from './constants'

const defaultState = fromJS({
  bookData: [],
  step: 0,
  borrowBook: [],
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.COMMIT_BORROWED_BOOK_DATA:
      return state.set('bookData', action.bookData)
    case constants.COMMIT_TRUE_BORROWED_BOOK_DATA:
      return state.set('borrowBook', action.borrowBook)
    case constants.CHANGE_STEP:
      return state.set('step', action.step)
    default:
      return state
  }
}
