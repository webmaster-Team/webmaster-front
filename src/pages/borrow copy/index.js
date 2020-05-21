import React, { PureComponent } from 'react'
import './style.styl'
import { Steps, Row, Col, Card, Avatar } from 'antd'
import { connect } from 'react-redux'
import ReadRFID from '../borrow/readrfid'
import CheckBook from '../borrow/checkBook'
import Process from '../borrow/process'
import { actionCreators as frameActionCreators}from '../container/store'
import { Route, Redirect } from 'react-router-dom'
class Borrow extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount () {
    this.props.changeSelect()
}

  render() {
    const { Step } = Steps
    const gridStyle = {
      width: '100%',
      textAlign: 'left',
    }
    const { cover, card, borrow, name } = this.props
    return (
      <div className="borrowWrapper">
        <Row gutter={[16, 16]}>
          <Col md={7} xs={24}>
            <div>
              <Steps direction="vertical" current={this.props.step}>
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
              <Route path="/index/borrow/readrfid" component={ReadRFID} />
              <Route path="/index/borrow/checkbook/:type" component={CheckBook} />
              <Route path="/index/borrow/process" component={Process} />
              <Redirect from="/index/borrow" to="/index/borrow/readrfid" />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapState = (state) => ({
  borrow: state.getIn(['login', 'borrow']),
  card: state.getIn(['login', 'card']),
  name: state.getIn(['login', 'name']),
  cover: state.getIn(['login', 'cover']),
  step: state.getIn(['borrow', 'step']),
})

const mapDispatch = (dispatch) => ({
  changeSelect () {
    dispatch(frameActionCreators.changeSelect('borrow'))
  }
})
export default connect(mapState, mapDispatch)(Borrow)
