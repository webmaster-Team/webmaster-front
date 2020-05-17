import React, { PureComponent } from 'react'
import './style.styl'
import { Steps, Row, Col, Card, Avatar } from 'antd'
import { connect } from 'react-redux'
import ReadRFID from '../../components/readrfid'
import CheckBook from '../../components/checkBook'
import { Route } from 'react-router'
class Borrow extends PureComponent {
  constructor(props) {
    super(props)
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
              <Steps direction="vertical" current={0}>
                <Step title="读取图书" description="读取待借阅的图书信息" />
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
              <Route
                path="/index/borrow/checkbook/:type"
                component={CheckBook}
              />
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
})

const mapDispatch = (dispatch) => ({})
export default connect(mapState, mapDispatch)(Borrow)
