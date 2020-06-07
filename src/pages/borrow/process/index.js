import React,{useState,useEffect} from 'react'
import { connect } from 'react-redux'
import { Card, Table, Avatar, Button,Spin,Alert } from 'antd'
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import { actionCreators } from '../store'
import {useHistory} from 'react-router-dom'
import Axios from '../../../utils/request'
import { actionCreators as frameac } from '../../container/store'
import DoneAllIcon from '@material-ui/icons/DoneAll';
import './style.styl'
const Process = props => {
  let history = useHistory()
  const [uploading, setUploading] = useState(true) 
  const [success,setSuccess] = useState(0)
  const [serial,setSerial] =useState("") //保存获得的订单号
  useEffect(() => {
    if(props.bookData.size === 0 && props.step !== 1)
        history.replace('/index/borrow/check')
     props.changeStep()
  }, [])

  //页面挂载去提交订单
  useEffect(()=>{
    //如果没有数据，就回到search页面
   
    Axios.post('/api/book/borrow',{
      books:props.bookData.map(Number)
    }).then(res=>{
      console.log(res)
      if(res.result === 1){
          setUploading(false)
          setSuccess(1)
          setSerial(res.serial)
          props.commitBorrowBook([])
      }else{
          setUploading(false)
          setSuccess(-1)
          props.modifyShowAlert(true,"借书订单提交失败",'error')
      }
    })
  },[])

    return (
      <div className="processbookWrapper">
        <Card title="温馨提示" bordered={false} size="small" className="tipsCard">
        <p>
         <span className="important">请不要退出</span>，耐心等待借书订单的生成。
        </p>
        <p>
        <span className="strong">建议:</span>若您不想要提交这个订单，您可以在订单生成的3分钟内取消该借书订单。
        </p>
      </Card>
        <Spin  tip="提交借书订单中，请不要退出，耐心等待..." spinning={uploading}>
            <div>{
                success === 1 ? (
                    <div className="spin">
                        <CheckCircleOutlineRoundedIcon className="icon success"/>
                        <div className="success-text">借书订单生成成功</div>
                        <div className="success-order">书单号为{serial}</div>
                        <Button  className="go-back" onClick={()=>history.replace('/index/usercenter')}>前往个人中心查看</Button>
                    </div>
                ) :(
                    success === -1?(
                        <div className="spin">
                        <HighlightOffRoundedIcon className="icon failure"/>
                        <div className="success-text">借书失败</div>
                        <Button danger className="go-back" onClick={()=>history.replace('/index/borrow')}>尝试回到上一步重新提交</Button>
                    </div>
                    ):<div className="spin"></div>
                )
            }
            </div>
        </Spin>
      </div>
    )
}

const mapState = (state) => ({
  bookData: state.borrow.get('bookData'),
  listData: state.borrow.get('listData'),
  step:state.borrow.get('step')
})
const mapDispatch = (dispatch) => ({
  commitBorrowBook(bookData) {
    dispatch(actionCreators.commitBorrowedBooks(bookData))
  },
  changeStep() {
    dispatch(actionCreators.changeStep(2))
  },
  modifyShowAlert(show, message, type) {
    dispatch(frameac.modifyShowAlert(show, message, type))
  },
})

export default connect(mapState, mapDispatch)(Process)
