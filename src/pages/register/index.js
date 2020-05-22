import React, { useEffect, useState, useRef } from 'react'
import './style.styl'
import { UploadOutlined } from '@ant-design/icons'
import { makeStyles } from '@material-ui/core/styles'
import Circle from '../../components/common/circle'
import InputAdornment from '@material-ui/core/InputAdornment'
import Input from '@material-ui/core/Input'
import PersonIcon from '@material-ui/icons/Person'
import { Upload, Button as AntdButton } from 'antd'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import Button from '@material-ui/core/Button'
import PhoneIcon from '@material-ui/icons/Phone'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import EmailIcon from '@material-ui/icons/Email'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import WcIcon from '@material-ui/icons/Wc'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import IconButton from '@material-ui/core/IconButton'
import PanoramaIcon from '@material-ui/icons/Panorama'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import { DropzoneDialog } from 'material-ui-dropzone'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import FaceIcon from '@material-ui/icons/Face'
import FormHelperText from '@material-ui/core/FormHelperText'
import Axios from '../../utils/request'
import { TextField, CheckboxWithLabel, RadioGroup } from 'formik-material-ui'
import Config from '../../config'
import { Formik, Form, Field } from 'formik'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Password from 'antd/lib/input/Password'
import Snackbar from '@material-ui/core/Snackbar'
import { useHistory } from 'react-router-dom'
let formInputColor = '#0182ff'

//引入swiper
let Swiper2 = window.Swiper

const useStyles = makeStyles({
  input: {
    marginLeft: '10px',
  },
  fieldRoot: {
    width: '100%',
  },
  closeButton: {
    color: formInputColor,
  },
  uploadRoot: {
    color: formInputColor,
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
  expand: {
    border: 'none',
    boxShadow: 'none',
    marginTop: '5px',
  },
  radioRoot: {
    color: formInputColor,
    // width: "10px",
    // height:"10px"
  },
  radioChecked: {
    // backgroundColor:formInputColor
  },
})

const SignupSchema = Yup.object().shape({
  account: Yup.string()
    .required('请输入学号')
    .matches(/^[0-9]+$/, '学号只包含数字')
    .length(13, '学号位数应该是13位的'),
  nickname: Yup.string()
    .required('请输入昵称')
    .min(2, '昵称至少包括2个字符')
    .matches(
      /^[0-9a-zA-Z\u4e00-\u9fa5_]+$/,
      '昵称只能由中文、数字、大小写字母、下划线组成'
    ),
  password: Yup.string()
    .required('请输入密码')
    .matches(
      /^[a-zA-Z0-9_]{5,}$/,
      '密码是只由数字、大小写字母、下划线组成的至少5位的字符串'
    ),
  phone: Yup.string().matches(/^1[3|4|5|8][0-9]\d{4,8}$/, '手机号码格式错误'),
  email: Yup.string().required('请输入邮箱').email('邮箱格式错误'),
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

const Register = (props) => {
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
  const classes = useStyles()
  //设置文件上传的state
  const [fileList, setFileList] = useState([])
  //设置文件的返回头像的state
  const [avatarUrl, setAvatarUrl] = useState('')
  //文件上传配置
  let uploadConfig = {
    name: 'portrait',
    multiple: false,
    listType: 'picture-card',
    method: 'post',
    action: `${Config.fileUploadBaseUrl}/api/user/upload`,
    beforeUpload: (file) => {
      return new Promise((resolve, reject) => {
        console.log(file)
        setFileList([file])
        const isJpgOrPng =
          file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
          // message.error('你只能上传JPG/PNG文件!
          setMessage('图片只支持jpeg、png')
          setType('error')
          setOpen(true)
          setAvatarUrl('')
          setInterval(() => {
            setOpen(false)
          }, 2000)
        }
        const isLt2M = file.size / 1024 < 800
        if (!isLt2M) {
          // message.error('图片必须小于800KB!')
          setMessage('图片必须小于800KB')
          setType('error')
          setOpen(true)
          setAvatarUrl('')
          setInterval(() => {
            setOpen(false)
          }, 2000)
        }
        if (isJpgOrPng && isLt2M) return resolve(true)
        else return reject(false)
      })
    },
    onRemove: (file) => {
      setFileList([])
      setAvatarUrl('')
    },
    onChange(info) {
      console.log(info)
      const { status, response } = info.file
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        //如果当前的上传状态是完成，我们去取服务器的返回数据
        if (response.result === 1) {
          // message.success('头像上传成功')
          setAvatarUrl(response.url)
          setFileList(info.fileList)
          setMessage('头像上传成功')
          setType('success')
          setOpen(true)
          setInterval(() => {
            setOpen(false)
          }, 2000)
        }
      } else if (status === 'error') {
        setMessage('头像上传失败')
        setType('error')
        setOpen(true)
        setAvatarUrl('')
        setInterval(() => {
          setOpen(false)
        }, 2000)
      }
    },
  }
  //数据源
  let data = [
    {
      title: '欢迎注册',
      text: ['杭州师范大学图书管理系统', '期待你的精彩'],
      picture:
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1504462560,2042218994&fm=26&gp=0.jpg',
    },
  ]
  //配置swiper
  let swiper = null
  useEffect(() => {
    if (swiper) {
      swiper.slideTo(0, 0)
      swiper.destroy()
      swiper = null
    }
    swiper = new Swiper2('.swiper-container', {
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
  useEffect(async () => await changeCaptcha(), [])

  const changeCaptcha = async () => {
    let res = await Axios.get('/api/user/drawImage', {
      responseType: 'text',
    })
    captcha.current.src = `data:image/jpg;base64,${res}`
  }

  return (
    <div className="registerWrapper">
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message={message}
      >
        <div
          className={
            'alert-wrapper ' + (type === 'success' ? 'success' : 'error')
          }
        >
          {message}
        </div>
      </Snackbar>
      <div className="title">REGISTER</div>
      <div className="bigCircle">
        <Circle color="#0082fe" innerColor="#ffffff" />
      </div>
      <div className="smallCircle">
        <Circle color="#8cc63e" innerColor="#ffffff" />
      </div>
      <div className="buttom-box">
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
                    <img
                      alt="显示"
                      className="swiper-picture"
                      src={item.picture}
                    />
                  </div>
                )
              })}
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>
        <div className="form">
          <div className="form-title">用户注册</div>
          <Formik
            initialValues={{
              account: '',
              nickname: '',
              password: '',
              sex: '1',
              identity: '0',
              email: '',
              captcha: '',
              policy: false,
              phone: '',
              cover: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values, { setFieldError }) => {
              // console.log('发送验证码')
              console.log(values)
              //校验验证码
              let res = await Axios.post('/api/user/checkImage', {
                image: values.captcha,
              })
              // res.result = 1 //由于后端未完成该接口，使用固定值代替
              //验证码验证成功
              if (res.result === 1) {
                //构建请求体
                let postData = {
                  card: values.account,
                  name: values.nickname,
                  password: values.password,
                  sex: parseInt(values.sex),
                  email: values.email,
                  identity: parseInt(values.identity),
                }
                if (values.phone !== '') postData.phone = values.phone
                if (avatarUrl !== '') postData.cover = avatarUrl
                //发送请求
                res = await Axios.post('/api/user/register', postData)
                //请求成功
                if (res.result === 1) {
                  setMessage('注册成功，即将跳转到登录页')
                  setType('success')
                  setOpen(true)
                  setInterval(() => {
                    history.replace('/login')
                  }, 2000)
                } else {
                  setMessage('账户注册出现问题')
                  setType('error')
                  setFieldError('account', '账号已存在')
                  setOpen(true)
                  changeCaptcha()
                }
              } else {
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
                    classes={{
                      root: classes.fieldRoot,
                    }}
                    component={TextField}
                    name="nickname"
                    placeholder="输入您的昵称"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <div className="form-ador">
                            <FaceIcon />
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
                  <Field component={RadioGroup} name="sex" className="sex">
                    <FormLabel className="sex-icon">
                      <WcIcon />
                    </FormLabel>
                    <FormControlLabel
                      value="1"
                      control={
                        <Radio
                          classes={{
                            root: classes.radioRoot,
                            checked: classes.radioChecked,
                          }}
                        />
                      }
                      label="男"
                    />
                    <FormControlLabel
                      value="0"
                      control={
                        <Radio
                          classes={{
                            root: classes.radioRoot,
                            checked: classes.radioChecked,
                          }}
                        />
                      }
                      label="女"
                    />
                  </Field>
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
                    classes={{
                      root: classes.fieldRoot,
                    }}
                    component={TextField}
                    name="email"
                    placeholder="输入您的邮箱"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <div className="form-ador">
                            <EmailIcon />
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
                    ref={captcha}
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
                            alt="验证码"
                            ref={captcha}
                            onClick={changeCaptcha}
                            className="captcha"
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
                  <ExpansionPanel classes={{ root: classes.expand }}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <div className="hr-text">其他选填或默认的选项</div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className="expansionPanelDetials">
                      <Field
                        component={RadioGroup}
                        name="identity"
                        className="sex identity"
                      >
                        <FormLabel className="sex-icon">
                          <PermIdentityIcon />
                        </FormLabel>
                        <FormControlLabel
                          value="0"
                          control={
                            <Radio
                              classes={{
                                root: classes.radioRoot,
                                checked: classes.radioChecked,
                              }}
                            />
                          }
                          label="学生"
                        />
                        <FormControlLabel
                          value="1"
                          control={
                            <Radio
                              classes={{
                                root: classes.radioRoot,
                                checked: classes.radioChecked,
                              }}
                            />
                          }
                          label="教师"
                        />
                      </Field>
                      <Field
                        classes={{
                          root: classes.fieldRoot,
                        }}
                        component={TextField}
                        name="phone"
                        placeholder="输入您的联系电话"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <div className="form-ador">
                                <PhoneIcon />
                              </div>
                            </InputAdornment>
                          ),
                          classes: {
                            input: classes.input,
                            root: classes.root,
                            focused: classes.focused,
                          },
                          className: 'form-input phone',
                        }}
                      />
                      <div className="img">
                        <div className="img-icon">
                          <PanoramaIcon />
                        </div>
                        <Upload {...uploadConfig} className="upload">
                          {fileList.length >= 1 ? null : (
                            <div>
                              <UploadOutlined />
                              <div className="ant-upload-text avatarButton">
                                提交头像
                              </div>
                            </div>
                          )}
                        </Upload>
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <Button
                    variant="contained"
                    className="login-button"
                    type="submit"
                  >
                    注册
                  </Button>
                  <div className="register-link">已有账号？回去登录</div>
                </form>
              )
            }}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Register
