import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { actionCreators } from './store'
import { actionCreators as registerActionCreators } from '../register/store'
import { Form, Input, Button, Checkbox, message } from 'antd'
import './style.styl'
class Login extends PureComponent {
  constructor(props) {
    super(props)
    this.validateMessages = {
      required: '请输入您的${label}',
      pattern: {
        mismatch: '${label}必须为13位数字',
      },
      string: {
        range: '${label}必须为${min}~${max}位的字符',
      },
    }
  }

  componentDidUpdate() {
    if (this.props.login) message.success('登陆成功')
    else message.error(`登陆失败，检查账号密码后重试(${this.props.tryTimes})！`)
  }

  componentDidMount() {
    this.props.resetRegister()
  }

  render() {
    const { login } = this.props
    const { tryLogin } = this.props
    if (login) {
      return <Redirect to="/index/borrow/readrfid"></Redirect>
    } else
      return (
        <div className="login">
          <div className="wrapper">
            <div className="container">
              <div className="title">登录</div>
              <Form
                size="large"
                validateMessages={this.validateMessages}
                onFinish={tryLogin}
              >
                <Form.Item
                  label="卡号"
                  name="account"
                  rules={[{ required: true, pattern: /^[0-9]{13}$/ }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="密码"
                  name="password"
                  className="smallBottom"
                  rules={[{ required: true, type: 'string', min: 6, max: 16 }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="agreement"
                  className="smallBottom"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              '若您要使用本产品，请同意我们的隐私政策'
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    我已经同意《图书管理系统》<Link to="/">隐私保护政策</Link>
                  </Checkbox>
                </Form.Item>
                <Form.Item className="smallBottom">
                  <Button type="primary" htmlType="submit" block>
                    立即登录
                  </Button>
                </Form.Item>
                <Form.Item>
                  <div className="parallelInput">
                    <Link to="/" className="plane">
                      忘记密码？
                    </Link>
                    <Link to="/register">没有账号？立即注册</Link>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      )
  }
}

const mapState = (state) => {
  return {
    login: state.getIn(['login', 'login']),
    showAlert: state.getIn(['login', 'login']),
    tryTimes: state.getIn(['login', 'tryTimes']),
    register: state.getIn(['register', 'register']),
  }
}

const mapDispatch = (dispatch) => ({
  tryLogin({ account, password }) {
    dispatch(actionCreators.tryLogin(account, password))
  },
  resetRegister() {
    dispatch(registerActionCreators.register(false))
  },
})

export default connect(mapState, mapDispatch)(Login)
