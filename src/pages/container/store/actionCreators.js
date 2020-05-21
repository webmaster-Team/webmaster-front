import * as constants from './constants'
import Axios from '../../../utils/request'

export const changeSelect = (select) => ({
  type: constants.CHANGE_SELECT,
  select,
})
