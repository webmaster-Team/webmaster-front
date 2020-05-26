import React, { useEffect, useCallback, useContext } from 'react'
import './style.styl'
import { StoreContext } from 'redux-react-hook'
import { Steps, Row, Col, Card, Avatar } from 'antd'
import { connect } from 'react-redux'
import Check from './check'
import Inspect from './inspect'
import { actionCreators as frameac } from '../container/store'
import { Route, Redirect, useHistory, Switch } from 'react-router-dom'
import Token from '../../utils/token'
import Axios from '../../utils/request'
//borrow组件
const Borrow = (props) => {
  console.log(props)
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

  //引入steps步骤条
  const { Step } = Steps
  const gridStyle = {
    width: '100%',
    textAlign: 'left',
  }

  return (
    <div className="borrowWrapper">
      <div className="stepBar">
        <Steps current={step}>
          <Step title="操作图书" description="操作您要借阅的书籍" />
          <Step title="确认图书" description="确认您要借阅的书籍" />
          <Step
            title="提交借书订单"
            description="提交您的书单"
          />
        </Steps>
      </div>
      <Row gutter={[16, 16]}>
        <Col md={4} xs={24}>
          <div>
            <div>
              <Card
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
          </div>
        </Col>
        <Col md={20} xs={24}>
          <div>
            <Switch>
              <Route path="/index/borrow/check" component={Check} />
              <Route path="/index/borrow/inspect" component={Inspect} />
              <Redirect from="/index/borrow" to="/index/borrow/check" />
            </Switch>
          </div>
        </Col>
      </Row>
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

export default connect(mapState, mapDispatch)(Borrow)
