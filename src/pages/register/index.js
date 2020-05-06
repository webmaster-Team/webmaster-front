import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { actionCreators } from './store'
import { Form, Input, Button, Checkbox, message, Radio, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import './style.styl'
class Register extends PureComponent {
  constructor(props) {
    super(props)
    this.validateMessages = {
      required: '请输入您的${label}',
      pattern: {
        mismatch: '${label}必须为13位数字',
      },
      types: {
        email: '邮箱格式不正确',
      },
      string: {
        range: '${label}必须为${min}~${max}位的字符',
      },
    }
    this.uploadConfig = {
      multiple: false,

      onRemove: (file) => {
        this.props.removeFile(file)
      },
      beforeUpload: (file) => {
        console.log(this.props.fileList)
        const isJpgOrPng =
          file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
          message.error('貌似不是JPG/PNG的文件格式，请重传!')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          message.error('图片必须为2MB以下!')
        }
        if (isJpgOrPng && isLt2M) {
          this.props.addFile(file)
        }
        return false
      },
    }
  }

  componentDidUpdate() {
    if (this.props.register) message.success('注册成功')
    else if (!this.props.register && this.props.tryTimes)
      message.error('注册失败')
  }

  render() {
    const { uploading, fileList } = this.props
    const { tryRegister } = this.props
    if (this.props.register) {
      this.props.history.replace('/login')
      return <div></div>
    } else
      return (
        <div className="register">
          <div className="wrapper">
            <div className="container">
              <div className="title">注册</div>
              <Form
                size="large"
                validateMessages={this.validateMessages}
                onFinish={tryRegister}
              >
                <Form.Item
                  label="卡号"
                  name="card"
                  rules={[{ required: true, pattern: /^[0-9]{13}$/ }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="昵称"
                  name="name"
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        let regex = /^[0-9]+$/
                        if (regex.test(value)) {
                          return Promise.reject('昵称不得为纯数字')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="手机号码"
                  name="phone"
                  rules={[
                    { required: true },
                    { pattern: /^[0-9]{11}$/, message: '手机号格式不正确' },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="sex"
                  label="性别"
                  rules={[{ required: true, message: '请选择您的性别' }]}
                >
                  <Radio.Group>
                    <Radio value="0">男</Radio>
                    <Radio value="1">女</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="头像">
                  <Form.Item name="dragger" noStyle>
                    <Upload.Dragger
                      name="files"
                      {...this.uploadConfig}
                      fileList={this.props.fileList}
                      // disabled={this.props.fileList.length >= 1 ? true : false}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        {fileList.length === 1
                          ? '拖拽或点击重新上传(JPG/PNG)'
                          : '拖拽或点击上传头像(JPG/PNG)'}
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
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
                    立即注册
                  </Button>
                </Form.Item>
                <Form.Item>
                  <div className="parallelInput">
                    <Link to="/" className="plane"></Link>
                    <Link to="/login">已有账号？立即登陆</Link>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      )
  }
}

const mapState = (state) => ({
  tryTimes: state.getIn(['register', 'tryTimes']),
  fileList: state.getIn(['register', 'fileList']),
  uploading: state.getIn(['register', 'uploading']),
  register: state.getIn(['register', 'register']),
})

const mapDispatch = (dispatch) => ({
  tryRegister(data) {
    console.log(data)
    dispatch(actionCreators.tryRegister(data))
  },
  removeFile(file) {
    dispatch(actionCreators.removeFile(file))
  },
  addFile(file) {
    dispatch(actionCreators.addFile(file))
  },
})
export default connect(mapState, mapDispatch)(Register)
