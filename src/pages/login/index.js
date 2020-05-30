import React, { useCallback, useEffect, useRef, useState } from 'react'
import './style.styl'
// import {Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Circle from '../../components/common/circle'
import InputAdornment from '@material-ui/core/InputAdornment'
import Input from '@material-ui/core/Input'
import PersonIcon from '@material-ui/icons/Person'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import FormHelperText from '@material-ui/core/FormHelperText'
import Axios from '../../utils/request'
import { TextField, CheckboxWithLabel } from 'formik-material-ui'
import Config from '../../config'
import { Formik, Form, Field } from 'formik'
import { useFormik } from 'formik'
import FormControl from '@material-ui/core/FormControl'
import * as Yup from 'yup'
import Password from 'antd/lib/input/Password'
import Token from '../../utils/token'
import Snackbar from '@material-ui/core/Snackbar'
import { useHistory, Link } from 'react-router-dom'
import { modifySelect } from '../container/store/actionCreators'
let formInputColor = '#0182ff'

const SignupSchema = Yup.object().shape({
  account: Yup.string()
    .required('请输入学号')
    .matches(/^[0-9]+$/, '学号只包含数字')
    .length(13, '学号位数应该是13位的'),
  password: Yup.string()
    .required('请输入密码')
    .matches(
      /^[a-zA-Z0-9_]{5,}$/,
      '密码是只由数字、大小写字母、下划线组成的至少5位的字符串'
    ),
  captcha: Yup.string().required('请输入验证码').length(4, '验证码有4位'),
  policy: Yup.boolean().test({
    name: 'policy',
    message: '您必须同意我们的隐私政策',
    test: (value) => {
      console.log('this is ' + value)
      return value
    },
  }),
})

const useStyles = makeStyles({
  input: {
    marginLeft: '10px',
  },
  fieldRoot: {
    width: '100%',
  },
  root: {
    marginLeft: '10px',
    // color: formInputColor,
    // borderBottomColor: formInputColor,
    // borderBottomWidth:"0.01px",
    // borderBottomStyle:"solid"
  },
  focused: {
    color: formInputColor,
  },
  button: {
    backgroundColor: '#0182ff',
  },
})

//引入swiper
let Swiper = window.Swiper
const Login = () => {
  //引入路由历史
  let history = useHistory()
  //设置消息条的类型
  const [type, setType] = React.useState('success') //或者error
  //设置消息条的显示
  const [open, setOpen] = React.useState(false)
  //设置错误消息
  const [message, setMessage] = React.useState('')
  //设置密码可见性
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  //设置swiper的元素引用
  const captcha = useRef(null)
  let swiper = null
  //ads的数据源
  const classes = useStyles()
  let data = [
    {
      title: '借书可以更快',
      text: [
        '现在全新的图书管理系统',
        '提供更加强劲的后台支持，为你的书海航行保驾护航',
      ],
      picture:
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1504462560,2042218994&fm=26&gp=0.jpg',
    },
    {
      title: '图书馆、塑造全新阅读',
      text: ['愈发重要的阅读过程，', '使得你在流畅的门户网站中肆意浏览'],
      picture:
        'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3854731791,3253266235&fm=26&gp=0.jpg',
    },
  ]
  useEffect(() => {
    if (swiper) {
      swiper.slideTo(0, 0)
      swiper.destroy()
      swiper = null
    }
    swiper = new Swiper('.swiper-container', {
      loop: true,
      autoplay: true,
      pagination: {
        el: '.swiper-pagination',
      },
    })
  }, [])

  const handleClickShowPassword = () => {
    setPasswordVisibility(!passwordVisibility)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  //页面挂载去获取验证码
  useEffect(() => changeCaptcha(), [])

  const changeCaptcha = () => {
    Axios.get('/api/user/drawImage', {
      responseType: 'text',
    }).then((res) => {
      captcha.current.src = `data:image/jpg;base64,${res}`
    })
  }

  return (
    <div className="loginPage">
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        // message={message}
      >
        <div
          className={
            'alert-wrapper ' + (type === 'success' ? 'success' : 'error')
          }
        >
          {message}
        </div>
      </Snackbar>
      <div className="title">LOGIN</div>
      <div className="wrapper">
        <div className="back" onClick={()=>history.push('/index/search')}>
          <span className="iconfont back-icon">&#xe755;</span>
          <span className="back-text">回到图书馆门户</span>
        </div>
        <div className="bigCircle">
          <Circle color="#0082fe" innerColor="#ffffff" />
        </div>
        <div className="smallCircle">
          <Circle color="#8cc63e" innerColor="#ffffff" />
        </div>
        <div className="card">
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {data.map((item, index) => {
                return (
                  <div className="swiper-slide" key={index}>
                    <div className="swiper-title">{item.title}</div>
                    {item.text.map((item, index) => {
                      return (
                        <div key={index} className="swiper-text">
                          {item}
                        </div>
                      )
                    })}
                    <img className="swiper-picture" src={item.picture} />
                  </div>
                )
              })}
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>

        <div className="form">
          <div className="form-title">用户登录</div>
          <Formik
            initialValues={{
              account: '',
              password: '',
              captcha: '',
              policy: false,
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values, { setFieldError }) => {
              console.log('发送验证码')

              let res = await Axios.post('/api/user/checkImage', {
                image: values.captcha,
              })
              //后端接口未完成
              // res.result = 1
              //验证码验证成功
              if (res.result === 1) {
                res = await Axios.post('/api/user/login', {
                  card: values.account,
                  password: values.password,
                })
                if (res.result === 1) {
                  //登录成功
                  Token.set(res.token)
                  setMessage('登录成功，即将跳转到门户')
                  setType('success')
                  setOpen(true)
                  setTimeout(() => {
                    history.replace('/index/search')
                  }, 2000)
                } else {
                  //登录失败
                  setMessage('账号密码不匹配，请检查')
                  setType('error')
                  setFieldError('account', '账号可能不正确')
                  setFieldError('password', '密码无法和账号匹配')
                  setOpen(true)
                  changeCaptcha()
                }
              } else {
                //验证码不正确
                setMessage('验证码不正确，请检查')
                setFieldError('captcha', res.msg)
                setType('error')
                setOpen(true)
                changeCaptcha()
              }
            }}
          >
            {({ errors, touched, submitForm, handleSubmit, isSubmitting }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Field
                    classes={{
                      root: classes.fieldRoot,
                    }}
                    component={TextField}
                    name="account"
                    placeholder="输入您的学号"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <div className="form-ador">
                            <PersonIcon />
                          </div>
                        </InputAdornment>
                      ),
                      classes: {
                        input: classes.input,
                        root: classes.root,
                        focused: classes.focused,
                      },
                      className: 'form-input',
                    }}
                  />
                  <Field
                    component={TextField}
                    name="password"
                    placeholder="请输入密码"
                    InputProps={{
                      type: passwordVisibility ? 'text' : 'password',
                      className: 'form-input',
                      startAdornment: (
                        <InputAdornment position="start">
                          <div className="form-ador">
                            <LockOpenIcon />
                          </div>
                        </InputAdornment>
                      ),
                      classes: {
                        input: classes.input,
                        root: classes.root,
                        focused: classes.focused,
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {passwordVisibility ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Field
                    component={TextField}
                    name="captcha"
                    InputProps={{
                      className: 'form-input',
                      inputProps: { 'aria-label': 'account' },
                      placeholder: '请输入验证码',
                      classes: {
                        input: classes.input,
                        root: classes.root,
                        focused: classes.focused,
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <div className="form-ador">
                            <VpnKeyIcon />
                          </div>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <img
                            ref={captcha}
                            onClick={changeCaptcha}
                            className="captcha"
                            src={`${Config.captchaBaseUrl}/api/user/drawImage`}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* 忘记密码？ */}
                  <div className="forget-link-line">
                    <span className="forget-link">忘记密码?</span>
                  </div>
                  <div className="policy-line">
                    <Field
                      size="small"
                      type="checkbox"
                      component={CheckboxWithLabel}
                      name="policy"
                      inputProps={{ 'aria-label': 'checkbox' }}
                      Label={{
                        label: (
                          <span className="policy">
                            我已经阅读了《杭州师范大学图书管理系统》的
                            <span className="policy-link">隐私保护政策</span>
                          </span>
                        ),
                      }}
                    />
                  </div>
                  <div className="policy-error">{errors.policy}</div>
                  <Button
                    variant="contained"
                    className="login-button"
                    type="submit"
                  >
                    登录
                  </Button>
                  <div className="register-link" onClick={()=>history.push('/register')}>没有账号？立即注册</div>
                  <hr />
                  <div className="third-login">
                    <a href="https://api.weibo.com/oauth2/authorize?client_id=323275235&response_type=code&redirect_uri=http://123.56.3.135:8080/api/user/weiboThreeLogin">
                      <span className="iconfont weibo-icon">&#xe882;</span>
                    </a>
                    <span className="iconfont qq-icon">&#xe6da;</span>
                    {/* <span className="weibo-text">微博登录</span> */}

                    {/* <span className="weibo-text">微博登录</span> */}
                    <span className="iconfont weixin-icon">&#xe699;</span>
                    {/* <span className="weibo-text">微博登录</span> */}
                  </div>
                </form>
              )
            }}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Login
