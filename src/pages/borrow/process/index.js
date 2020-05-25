import React, { useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import Axios from '../../../utils/request'
import { Card, Table, Avatar, Button, message, Tag } from 'antd'
import { actionCreators } from '../store'
import { actionCreators as frameac } from '../../container/store'
import { withTheme } from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress'
import moment from 'moment'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import './style.styl'
const Process = (props) => {
  const [completed, setCompleted] = React.useState(0) //记录完成的进度
  const [QCodeList,setQCodeList] = useState([])
  let history = useHistory() 

  useEffect(() => {
    if (completed === 100)
       history.push('/index/borrow/end')
  },[completed])
  
  //发送借书请求
  useEffect(() => {
    props.changeStep()
    setCompleted(0)
    let axioses = []
    props.bookData.map((item, index) => {
       axioses.push(
         Axios.post('/api/book/borrow', { bookId: parseInt(item), userId: parseInt(props.id)})
       )     
    })
    setCompleted(33)
    //后端异常
    Axios.all(axioses).then(
      axios.spread((...res) => {
        let resListData = []
        console.log(res.length)
        let newBorrowResultList = []
        res.forEach((value) => {
          console.log(value)
          if (value.result === 1) {
            newBorrowResultList.push(value.data)
          } else {
            props.modifyShowAlert(true, '有书籍借阅失败', 'error')
          }
        })
        props.modifyBorrowResultList(newBorrowResultList)
        setCompleted(100)
      }
      ))
    history.push('/index/borrow/end')
  }, [])


  return (
    <div className="processWrapper">
      <LinearProgress variant="determinate" value={completed} />
      <Card title="温馨提示" bordered={false} size="small">
        <p>
          当前图书馆正在处理您的书单，您可以直接退出该页面进行其他操作，一般借书需要1-2工作日.
        </p>
      </Card>
      <div>
        {completed >= 30 ? (
          <div classsName="infoLine">等待图书馆接收借书---完成</div>
        ) : (
          <div classsName="infoLine">等待图书馆接收借书...</div>
        )}
        {completed >= 60 ? (
          <div classsName="infoLine">图书馆正在处理您的借书---完成</div>
        ) : (
          <div classsName="infoLine">图书馆正在处理您的借书...</div>
        )}
        {completed >= 90? <div classsName="infoLine"> 图书馆打包---完毕</div>: <div classsName="infoLine">图书馆打包...</div>}
      </div>
      <div className="oprationbuttons">
        <Button>回到借书步骤一</Button>
      </div>
    </div>
  )
}

const mapState = (state) => ({
  bookData: state.borrow.get('bookData'), //存储bookID
  id: state.frame.get('id'),
  showAlert: state.frame.get('showAlert'),
  message: state.frame.get('message'),
  messageType: state.frame.get('messageType'),
  borrowResultList: state.frame.get('borrowResultList'),
})
const mapDispatch = (dispatch) => ({
  changeStep() {
    dispatch(actionCreators.changeStep(2))
  },
  modifyShowAlert(show, message, type) {
    dispatch(frameac.modifyShowAlert(show, message, type))
  },
  modifyBorrowResultList (borrowResultList) {
    dispatch(actionCreators.modifyBorrowResultData(borrowResultList))
  }
})

export default connect(mapState, mapDispatch)(Process)
