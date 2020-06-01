import React, { useState, useEffect,useCallback } from 'react'
import {connect} from 'react-redux'
import {actionCreators as frameac} from '../../../container/store'
import { Collapse, Select,List ,Row,Table, BackTop,Avatar,Col,Button as AButton} from 'antd';
import Typography from '@material-ui/core/Typography'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { SettingOutlined } from '@ant-design/icons';
import { makeStyles } from '@material-ui/core/styles'
import CardActionArea from '@material-ui/core/CardActionArea'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card'
import Mount from 'moment'
import {useHistory} from 'react-router-dom'
import Axios from '../../../../utils/request'
import './style.styl'
import { Button } from '@material-ui/core';
import { isFuture } from 'date-fns';
const { Panel } = Collapse;
const { Option } = Select;
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 700,
    height: '40px',
    boxShadow: '0px 0px 30px 1px rgba(0,0,0,0.1)',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  cardRoot: {
    width: "100%",
    maxWidth:"200px",
    margin: '10px',
  },
  media: {
    height: 200,
  },
}))


const RightCard = props => {
  //引入history对象
  const history = useHistory()
  //引入class
  const classes = useStyles()
  //存储该用户的所有的订单
  const [order,setOrder] = useState([])
  //存储该用户的所有的已借的书籍
  const [borrowingBooks,setBorrowingBooks] = useState([])
  //存储该用户的所有的已经归还的书籍
  const [revertBooks,setRevertBooks] = useState([])
  //存储是否打开提示用户是否取消预定指定订单的警告框
  const [open,setOpen] = useState(false)
  //存储需要显示在警告框中的订单信息
  const [willCancelledOrder,setWillCancelledOrder] = useState({})
  //存储需要显示在警告框中的属于待取消订单的所有书籍
  const [willCancelledOrderBooks,setWillCancelledOrderBooks] = useState([])
  //存储需要显示详细内容的订单号列表
  const [serialList,setSerialList] = useState([])
  //存储需要显示的订单详细内容
  const [serialDetail,setSerialDetail] = useState({})

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
     }
  ]

  useEffect(()=>{
    getAllOrder()
    getAllIsBorrowingBooks()
    getAllRevertBooks()
    let clock =  setInterval(()=>{
      getAllOrder()
    },10000)
    return ()=>{
       clearInterval(clock)
    }
  },[])

  //根据返回的订单数据来判断是否关闭当前正在打开的警告框
  useEffect(()=>{
     order.map((item,index)=>{
      if(item.serial === willCancelledOrder.serial && !item.canCancel)
          setOpen(false)
    })
  },[order])

  
  //打开提示用户是否取消预定订单的警告框
  const handleOpen = (item) => {
    setWillCancelledOrder(item)
    let newList = []
    item.books.map((item1,index1)=>{
       newList.push(`《${item1.name}》`)
    })
    setWillCancelledOrderBooks(newList)
    setOpen(true)
  };

  //关闭提示用户是否取消预定订单的警告框
  const handleClose = () => {
    setOpen(false);
  };

  //点击取消预定订单的按钮的执行逻辑
  const handleCancelBorrowOrder = (serial)=>{
    handleClose(false)
    Axios.post('/api/order/cancelOrder',{serial})
    .then(res=>{
       if(res.result === 1){
         getAllOrder()
       }else{
         props.modifyShowAlert(true,res.msg,'error')
       }
    })
  }

  //获取用户的所有订单
  const getAllOrder = useCallback(()=>{
     Axios.post('/api/order/getSimpleOrders',{})
     .then(res=>{
       if(res.result === 1){
           setOrder(res.data)
       }else{
         props.modifyShowAlert(true,res.msg,'error')
       }
     })
  },[willCancelledOrder])

  //获取用户的所有正在借阅的书籍
  const getAllIsBorrowingBooks = ()=>{
    Axios.post('/api/user/getUserIsBorrowingBook',{})
    .then(res=>{
      if(res.result === 1){
          setBorrowingBooks(res.data)
      }else{
        props.modifyShowAlert(true,res.msg,'error')
      }
    })
  }

  //获取用户的所有已经归还的书籍
  const getAllRevertBooks = ()=>{
    Axios.post('/api/user/getUserHasReturnedBook',{})
    .then(res=>{
      if(res.result === 1)
           setRevertBooks(res.data)
      else
           props.modifyShowAlert(true,res.msg,'error')
    })
  }

  //将获得的表示该订单状态的数字转化成对应的文字和颜色表示
  const reflectStateNumberToArray = (number)=>{
    switch(number){
      case 0:
        return ['在准备',"#00BFFF"]
      case 1:
        return ['待取阅',"#228B22"]
      case 2:
        return ['已完成',"grey"]
      case 3:
        return ['未取书',"#CD950C"]
      case 4:
        return ['预约已取消',"#B22222"]
    }
  }

  //当选择了不同的订单面板时所执行的业务逻辑
  const handleChangePannel = (serial,serialList)  =>{
     let newSerialList = serialList.concat()
     if(newSerialList.includes(serial)){
        newSerialList = newSerialList.filter(item=>item !== serial)
     }else{
       newSerialList.push(serial)
     }
     setSerialList(newSerialList)
  }

  //根据serialList的变动，来修改我们需要显示详情的数据
  useEffect(()=>{
    let axioses = []
    for(var i = 0 ; i < serialList.length ; i++){
      axioses.push(Axios.post('/api/order/getOrderData',{serial:serialList[i]}))
    }
    let newSerialDetail = {}
    Axios.all(axioses).then(res=>{
      res.map((resItem,index)=>{
        if(resItem.result === 1){
           newSerialDetail[serialList[index]]=resItem.data
        }
      })
      console.log(newSerialDetail)
      setSerialDetail(newSerialDetail)
    })
  },[serialList])

  return <div className="right-card-container">
     <Dialog
        open={open}
        aria-labelledby="提示用户是否取消预定书籍的警告框的标题"
        aria-describedby="提示用户是否取消预定书籍的警告框的内容"
      >
        <DialogTitle id="alert-dialog-title">提示</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
您是否确定要取消{willCancelledOrder.serial}借书订单，该订单包含{willCancelledOrderBooks.join(',')}
这{willCancelledOrderBooks.length}本书,一旦取消将无法继续借阅该订单
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            在考虑考虑
          </Button>
          <Button onClick={()=>handleCancelBorrowOrder(willCancelledOrder.serial)} color="primary">
            是的
          </Button>
        </DialogActions>
      </Dialog>
    <Collapse
    defaultActiveKey={['1']}
  >
    <Panel header="我的书单" key="1">
        <List
        size="large"
        dataSource={order}
        renderItem={item => <List.Item key={item.serial}>
              <Collapse
                className="collapse"
                bordered={false}
                onChange={()=>handleChangePannel(item.serial,serialList)}
               >
                  <Panel header={
                     <div className="order" key={item.serial}>
                    <Row gutter={6}>
                   <Col span={4}>
                     <div className="order-img">
                      {
                        item.books.map((item1,index1)=>{
                          if(index1 === 3) return <span>.....</span>
                          if(index1 > 3) return ""
                          return <img src={item1.cover} width={40} key={index1}/>
                        })
                      }
                    </div>
                 </Col>
                 <Col span={5}>
                    <div className="order-number-desc">
                       <span className="">《{ typeof item.books[0] === 'undefined'? "":item.books[0].name}》</span>等<span>{item.books.length}</span>本书
                    </div>
                 </Col>
                 <Col span={8}>
                    <div className="order-serial-desc">
                       书单号:<span className="grey-text" >{item.serial}</span>
                     </div>
                 </Col>
                 <Col span={3}>
                    <div className="order-state-desc">
                       状态:<span style={{color:reflectStateNumberToArray(item.state)[1]}}>{reflectStateNumberToArray(item.state)[0]}</span>
                    </div>
                 </Col>
                 <Col span={3}>
                     { 
                       item.canCancel? 
                       <Button color="secondary" onClick={()=>handleOpen(item)}>
                         取消该书单
                       </Button>
                       :null
                     }   
                  </Col>
                </Row>
              </div>
              } key={item.serial}>
                {
                  serialList.map((item2,index)=>{
                    if(item2 === item.serial){
                      for(let [key,value] of Object.entries(serialDetail)){
                        if(key === item2)
                          return (
                            <div className="collapse-order-detial">
                                <Table
                                  pagination={false}
                                  rowKey="table"
                                  className="table"
                                  dataSource={value.books}
                                  columns={columns}/>
                                  {
                                  (
                                    value.state === 1 ?
                                    (
                                      <div className="collapse-order-detail-right">
                                      <div className="collapse-order-detail-right-qrcode">
                                        <img src={value.qrcode} width={150}/>
                                      </div>
                                      <div><span className="collpase-order-detail-right-text">创建时间 | </span>{Mount(value.createTime).format('YYYY-MM-DD')}</div>
                                      <div><span className="collpase-order-detail-right-text">完成时间 | </span>{value.completeTime === "0"? "订单未完成":Mount(value.completeTime).format('YYYY-MM-DD')}</div>    
                                      </div>     
                                    ):(
                                      <div  className="collapse-order-detail-right-no-relative">
                                       <div><span className="collpase-order-detail-right-text">创建时间 | </span>{Mount(value.createTime).format('YYYY-MM-DD')}</div>
                                       <div><span className="collpase-order-detail-right-text">完成时间 | </span>{value.completeTime === "0"? "订单未完成":Mount(value.completeTime).format('YYYY-MM-DD')}</div>         
                                      </div>
                                    ))
                                    }
                            </div>
                         )
                      }
                    }
                  })
                }
           </Panel>
            </Collapse>
          </List.Item>
        }
      />
      <div className="arrive-end-tag">到底啦</div>
    </Panel>
    <Panel header="已借书籍" key="2" extra={
         <AButton type="link" size="small" onClick={()=>history.push('/index/renew')}>前往续借</AButton>
    }>
      <div className="is-borrowing-books">
      {
         borrowingBooks.map((item,index)=>{
           return (
            <Card className={classes.cardRoot} key={item.id}>
            <CardActionArea
            >
              <CardMedia
                className={classes.media}
                image={item.cover}
                title="cover"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="body1"
                  component="h2"
                  className="bookname"
                >
                  {item.name}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  component="h6"
                  className="bookauthor"
                >
                  {item.author} | 所作
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  component="h6"
                  className="bookpublisher"
                >
                  {item.publisher} | 出版
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  component="h6"
                  className="bookpublisher"
                >
                  { Mount(item.borrowTime).format('YYYY-MM-DD')} | 借阅时间
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
           )
         })
      }
      <div className="arrive-end-tag">到底啦</div>
      </div>
   </Panel>
   <Panel header="已归还书籍" key="3">
   <div className="is-borrowing-books">
      {
         revertBooks.map((item,index)=>{
           return (
            <Card className={classes.cardRoot} key={item.id}>
            <CardActionArea
            >
              <CardMedia
                className={classes.media}
                image={item.cover}
                title="cover"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="body1"
                  component="h2"
                  className="bookname"
                >
                  {item.name}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  component="h6"
                  className="bookauthor"
                >
                  {item.author} | 所作
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  component="h6"
                  className="bookpublisher"
                >
                  {item.publisher} | 出版
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  component="h6"
                  className="bookpublisher"
                >
                  { Mount(item.borrowTime).format('YYYY-MM-DD')} | 借阅时间
                </Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  component="h6"
                  className="bookpublisher"
                >
                  {Mount(item.returnTime).format('YYYY-MM-DD')} | 归还时间
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
           )
         })
      }
      <div className="arrive-end-tag">到底啦</div>
      </div>
   </Panel>
  </Collapse>
       <BackTop>
         <div className="back-top-button"><ArrowUpwardIcon/></div>
       </BackTop>
    </div>
}

const mapState = (state) => ({
    login: state.frame.get('login'),
    showAlert: state.frame.get('showAlert'),
    message: state.frame.get('message'),
    messageType: state.frame.get('messsageType'),
    email:state.frame.get('email'),
    name: state.frame.get('name'),
    card: state.frame.get('card'),
    cover: state.frame.get('cover'),
    hasBorrowed: state.frame.get('hasBorrowed'),
    isBorrowing: state.frame.get('isBorrowing'),
    identity: state.frame.get('identity'),
    sex:state.frame.get('sex'),
    phone:state.frame.get('phone'),
    signTime:state.frame.get('signTime')
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
  
export default connect(mapState, mapDispatch)(RightCard)
