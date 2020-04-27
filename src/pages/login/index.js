import React, { PureComponent } from 'react'
import { LButton } from './style'
// import { Redirect } from 'react-router-dom' //重定向
import { connect } from 'react-redux'
import { actionCreators } from './store'
// import { Link } from 'react-router-dom' //相当于a

class Login extends PureComponent {
  render() {
    const { login, exchangeLogin } = this.props
    return <LButton onClick={exchangeLogin}>{login + ''}</LButton>
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
