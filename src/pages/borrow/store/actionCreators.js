import * as constants from './constants'
import Axios from '../../../utils/request'

export const commitBorrowedBooks = (bookData) => ({
  type: constants.COMMIT_BORROWED_BOOK_DATA,
  bookData,
})

export const changeStep = (step) => ({
  type: constants.CHANGE_STEP,
  step,
})

export const commitTrueBorrowedBook = (borrowBook) => ({
  type: constants.COMMIT_TRUE_BORROWED_BOOK_DATA,
  borrowBook,
})

export const modifyListData = listData => ({
  type: constants.MODIFY_LIST_DATA,
  listData
})

export const modifyBorrowResultData = borrowResultData => ({
  type: constants.MODIFY_BORROW_RESULT_DATA,
  borrowResultData
})