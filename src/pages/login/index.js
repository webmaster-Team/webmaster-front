import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { actionCreators } from './store'

import { Card } from 'antd'
// import {  } from '@ant-design/icons';

import './style.less'

class Login extends PureComponent {
  render() {
    const { login, exchangeLogin } = this.props
    return (
      <div className="wrapper">
        <Card
          title="Default size card"
          extra={<a href="#">More</a>}
          style={{ width: 300 }}
        >
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
        <Card
          size="small"
          title="Small size card"
          extra={<a href="#">More</a>}
          style={{ width: 300 }}
        >
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    login: state.getIn(['login', 'login']),
  }
}

const mapDispatch = (dispatch) => ({
  exchangeLogin() {
    dispatch(actionCreators.exchangeLogin())
  },
})

export default connect(mapState, mapDispatch)(Login)
