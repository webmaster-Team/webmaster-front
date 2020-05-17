import { fromJS } from 'immutable'
import * as constants from './constants'

const defaultState = fromJS({
  bookData: [],
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.COMMIT_BORROWED_BOOK_DATA:
      return state.set('bookData', action.bookData)
    default:
      return state
  }
}
