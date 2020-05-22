import * as constants from './constants'
import Axios from '../../../utils/request'

export const modifySelect = (select) => ({
  type: constants.CHANGE_SELECT,
  select,
})