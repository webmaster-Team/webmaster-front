import React, { useEffect, useCallback, useContext } from 'react'
import './style.styl'
import { StoreContext } from 'redux-react-hook'
import { Steps, Row, Col, Card, Avatar } from 'antd'
import { connect } from 'react-redux'
import ReadRFID from '../../components/readrfid'
import CheckBook from '../../components/checkBook'
import Process from '../../components/process'
import { actionCreators as frameac } from '../container/store'
import { Route, Redirect, useHistory } from 'react-router-dom'

//borrow组件
const Borrow = (props) => {
  console.log(props)
  let history = useHistory()
  // 获取store中的数据
  let {
    select,
    login,
    showAlert,
    message,
    messageType,
    name,
    card,
    cover,
    borrow,
    step,
  } = props

  // useEffect(() => {
  //   console.log(login)
  // }, [login])

  //引入steps步骤条
  const { Step } = Steps
  const gridStyle = {
    width: '100%',
    textAlign: 'left',
  }

  if (!login) history.replace('/login')

  return (
    <div className="borrowWrapper">
      <Row gutter={[16, 16]}>
        <Col md={7} xs={24}>
          <div>
            <Steps direction="vertical" current={step}>
              <Step title="读取图书" description="读取待借阅的图书信息" />
              <Step title="确认图书" description="确认您要借阅的图书列表" />
              <Step title="提交请求" description="处理您的借阅请求" />
            </Steps>
            <div>
              <Card
                title="用户信息"
                extra={<Avatar size="small" src={cover} />}
              >
                <Card.Grid style={gridStyle}>卡号：{card}</Card.Grid>
                <Card.Grid style={gridStyle}>姓名：{name}</Card.Grid>
                <Card.Grid style={gridStyle}>已借阅：{borrow}本</Card.Grid>
              </Card>
            </div>
          </div>
        </Col>
        <Col md={17} xs={24}>
          <div>
            {/* <Route path="/index/borrow/readrfid" component={ReadRFID} /> */}
            {/* <Route path="/index/borrow/checkbook/:type" component={CheckBook} /> */}
            {/* <Route path="/index/borrow/process" component={Process} /> */}
            {/* <Redirect from="/index/borrow" to="/index/borrow/readrfid" /> */}
          </div>
        </Col>
      </Row>
    </div>
  )
}

const mapState = (state) => ({
  select: state.frame.get('select'),
  login: state.frame.get('login'),
  showAlert: state.frame.get('showAlert'),
  message: state.frame.get('message'),
  messageType: state.frame.get('messsageType'),
  name: state.frame.get('name'),
  card: state.frame.get('card'),
  cover: state.frame.get('cover'),
  borrow: state.frame.get('borrow'),
  step: state.borrow.get('step'),
})

const mapDispatch = (dispatch) => ({})

export default connect(mapState, mapDispatch)(Borrow)
