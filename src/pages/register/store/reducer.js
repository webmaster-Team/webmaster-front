import { fromJS } from 'immutable'
import * as constants from './constants'

const defaultState = fromJS({
  id: '',
  name: '',
  cover: '',
  card: '',
  msg: '',
  tryTimes: 0,
  uploading: true,
  fileList: [],
  register: false,
  tryTimes: 0,
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.REMOVE_FILE:
      let index = state.get('fileList').indexOf(action.file)
      var newFileList = state.get('fileList').slice()
      newFileList.splice(index, 1)
      return state.set('fileList', newFileList)
    case constants.ADD_FILE:
      return state.set('fileList', [action.file])
    case constants.REGISTER:
      return state.merge({
        register: action.register,
        tryTimes: state.get('tryTimes') + 1,
      })
    default:
      return state
  }
}
