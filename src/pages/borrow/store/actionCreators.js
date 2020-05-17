import * as constants from './constants'
import Axios from '../../../utils/request'

export const commitBorrowedBooks = (bookData) => ({
  type: constants.COMMIT_BORROWED_BOOK_DATA,
  bookData,
})
