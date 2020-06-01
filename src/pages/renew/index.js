import React, { useEffect, useCallback, useContext, useState } from 'react'
import './style.styl'
import { StoreContext } from 'redux-react-hook'
import { Steps, Row, Col, Card, Avatar ,Table,Button,Progress} from 'antd'
import { connect } from 'react-redux'
import { actionCreators as frameac } from '../container/store'
import { Route, Redirect, useHistory, Switch } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Token from '../../utils/token'
import Axios from '../../utils/request'
import Config from '../../config'
//borrow组件
const Renew = (props) => {
  console.log(props)
  const [listData,setListData] = useState([])
  const [hasExceed,setHasExceed] = useState(false) 
  const [openDialog,setOpenDialog] = useState(false)
  const [dialogBook,setDialogBook] = useState({})
  let history = useHistory()
  // 获取store中的数据
  let {
    select,
    login, //记录用户的登录状态
    showAlert,
    message,
    messageType,
    name,
    card,
    cover,
    hasBorrowed,
    isBorrowing,
    step,
    identity,
  } = props

  //如果login状态发生变化，就要重新查看是否有进入usercenter的权限
  useEffect(()=>{
    if(login || Token.validate()){
    }else
        history.replace('/login')
  },[login])

  //验证是否登录
  useEffect(() => {
    //如果内存里登录成功了，就可以直接获取数据了
    if (login) {
      Axios.post('/api/user/getUserData', {}).then((res) => {
        if (res.result === 1) {
          props.modifyUserInfo({
            id: res.data.id,
            card: res.data.card,
            name: res.data.name,
            cover: res.data.cover,
            identity: res.data.identity,
            hasBorrowed: res.data.hasBorrowed,
            isBorrowing: res.data.isBorrowing,
          })
        } else {
          props.modifyShowAlert(true, '获取您的信息失败', 'error')
        }
      })
    } else {
      //可能用户可能token是存在的，但是没有登录,如果验证成功，直接获取数据了
      if (Token.validate()) {
      } else {
        //用户根本没有登录，我们尝试进行登录
        if (props.location.search !== '') {
          //说明是由第三方登录进来的，这个链接只有可能是通过第三方登录进来的
          let token_array = props.location.search
            .split('?')[1]
            .split('&')[0]
            .split('=')
          if (token_array[0] === 'token') {
            //本地没有token，那就设置一个token
            Token.set(token_array[1])
          } else {
            //说明没有token，重定向到login页面进行登录
            history.replace('/login') 
          }
        } else {
          history.replace('/login')
        }
      }
    }
    //用户已经登录了
    if (!login) {
      //如果login为false，说明用户数据也要更新
      props.modifyLogin(true)
      //获取用户数据
      Axios.post('/api/user/getUserData', {}).then((res) => {
        if (res.result === 1) {
          props.modifyUserInfo({
            id: res.data.id,
            card: res.data.card,
            name: res.data.name,
            cover: res.data.cover,
            identity: res.data.identity,
            hasBorrowed: res.data.hasBorrowed,
            isBorrowing: res.data.isBorrowing,
          })
        } else {
          props.modifyShowAlert(true, '获取您的信息失败', 'error')
        }
      })
    } else {
    }
  }, [])
  
  useEffect(()=>{
    // if(login){
     Axios.post('/api/user/getUserIsBorrowingBook',{})
     .then(res=>{
         //获取用户正在借阅书籍成功
         if(res.result === 1){
             setListData(res.data)
             res.data.map((item,index)=>{
               if(item.distance < 0){
                 setHasExceed(true)
                }
             })
         }else{
             props.modifyShowAlert(true,"获取用户已借书籍失败","error")
         }
     })
    // }
  },[])

  //引入steps步骤条
  const { Step } = Steps
  const gridStyle = {
    width: '100%',
    textAlign: 'left',
  }

  //求借书时间百分比
  const getBorrowDurationPersent = (text,record)=>{
     if(record.isReborrow)
         return  parseInt((Config.getBorrowDuration(identity) + 30- parseInt(text))/ (Config.getBorrowDuration(identity) + 30) * 100)
     else
        return  parseInt((Config.getBorrowDuration(identity)- parseInt(text))/ Config.getBorrowDuration(identity) * 100)
  }
  
  const columns = [
    {
      title: '书封',
      dataIndex: 'cover',
      key: 'cover',
      render: (text, record, index) => <Avatar src={text} />,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '书名',
      dataIndex: 'name',
      key: 'name',
    },
     {
       title: '作者',
       dataIndex: 'author',
       key: 'author',
    },
     {
       title: '出版社',
       dataIndex: 'publisher',
       key: 'publisher',
     },
    {
      title: '剩余到期天数',
      dataIndex: 'distance',
      key: 'distance',
      render: (text,record)=>{
        console.log(record)
          return (
           <div className="remainDateInfo">
             <Progress showInfo={false} percent={getBorrowDurationPersent(text,record)} status={getBorrowDurationPersent(text,record) >= 90? "exception":"active"} />
             &nbsp;&nbsp;
             <span className="remainDateInfoText">{(parseInt(text) < 0 ? `超${Math.abs(parseInt(text))}天`:`剩${text}天`)}</span>
             </div>
          )
      }
    },
    {
        title: '操作',
        dataIndex: 'isReborrow',
        key: 'operation',
        render: (text,record,index)=>{
          //已续借并未超期
          if(record.isReborrow && record.distance > 0){
            return <Button className="successText" type="primary" onClick={()=>props.modifyShowAlert(true,"请前往图书馆归还","warning")}>归还</Button>
          }else{
             //说明有逾期的书
          if(hasExceed){
            if(record.distance > 0)
             return <Button type="primary"  disabled>续借</Button>
            else
            return <Button danger  type="primary">缴纳罚金</Button>
          }
          else{
            record.index = index
            return <Button type="primary" onClick={()=>openRenewDialog(record)}>续借</Button>
          }
        }
        }
      },
  ]

  //续借按钮按下
  const openRenewDialog = (record)=>{
    setDialogBook(record)
    setOpenDialog(true)
  }

  //按下续借按钮，发起续借
  const setRenewBook = ()=>{
    console.log(dialogBook)
    Axios.post('/api/book/extendBorrow',{bookId:dialogBook.id}).then(res=>{
      if(res.result === 1){
          let newListData = listData.concat()
          newListData[dialogBook.index].distance += 30 //时间增加30天
          newListData[dialogBook.index].isReborrow = true
          setListData(newListData)
      }
      else{
          props.modifyShowAlert(true,'续借失败',"error")
      }
    })
    setOpenDialog(false)
  }

  return (
    <div className="renewWrapper">
       <Dialog
        open={openDialog}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogTitle id="alert-dialog-description">
          你确定要续借&nbsp;&nbsp;<span className="dialogBookName">《{dialogBook.name}》</span>&nbsp;&nbsp;?
          </DialogTitle>
          <DialogContentText id="alert-dialog-description" className="dialogBookText">
            借书归还时间顺延30天
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="primary"  color="primary"  onClick={()=>setRenewBook()}>
             是的
          </Button>
          <Button color="primary"  onClick={()=>setOpenDialog(false)}>
             再考虑考虑
          </Button>
        </DialogActions>
      </Dialog>
      <div className="infoLine">
              <Card
                className="infoCard"
                title="用户信息"
                extra={<Avatar size="small" src={cover} />}
              >
                <Card.Grid style={gridStyle}>卡号 | {card}</Card.Grid>
                <Card.Grid style={gridStyle}>姓名 | {name}</Card.Grid>
                <Card.Grid style={gridStyle}>身份 | {identity}</Card.Grid>
                <Card.Grid style={gridStyle}>
                  已借阅 | {hasBorrowed} 本
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  正在借阅 | {isBorrowing} 本
                </Card.Grid>
              </Card>
      </div>
      <div className="renewbookWrapper">
      <Card title="温馨提示" bordered={false} size="small" className="tipsCard">
        <p>
          您可以在此处续借您之前借阅的图书，若您想要归还图书，请<span className="important">前往图书馆进行归还</span>，目前平台不支持归还书籍。
        </p>
      </Card>
      <Table
        pagination={false}
        rowKey="table"
        className="table"
        dataSource={listData}
        columns={columns}
      />
    </div>
    </div>
  )
}

const mapState = (state) => ({
  login: state.frame.get('login'),
  showAlert: state.frame.get('showAlert'),
  message: state.frame.get('message'),
  messageType: state.frame.get('messsageType'),
  name: state.frame.get('name'),
  card: state.frame.get('card'),
  cover: state.frame.get('cover'),
  hasBorrowed: state.frame.get('hasBorrowed'),
  isBorrowing: state.frame.get('isBorrowing'),
  step: state.borrow.get('step'),
  identity: state.frame.get('identity'),
})

const mapDispatch = (dispatch) => ({
  //修改用户的数据
  modifyUserInfo(info) {
    dispatch(frameac.modifyUserInfo(info))
  },
  modifyLogin(state) {
    dispatch(frameac.modifyLogin(state))
  },
  modifyShowAlert(show, message, type) {
    dispatch(frameac.modifyShowAlert(show, message, type))
  },
})

export default connect(mapState, mapDispatch)(Renew)
