import React, { useEffect, useState, useRef,useCallback } from 'react'
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
// import { white } from '_ansi-colors@3.2.4@ansi-colors';
import CircularProgress from '@material-ui/core/CircularProgress'
import { resolve } from 'url'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import Zoom from '@material-ui/core/Zoom'
import Fab from '@material-ui/core/Fab'
import { Carousel } from 'antd'
import SwipeableViews from 'react-swipeable-views'
import { green } from '@material-ui/core/colors'
import CheckIcon from '@material-ui/icons/Check'
// import { setUseProxies } from '_immer@1.10.0@immer';
import clsx from 'clsx'
//设置计时器
let myInterval = null
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
  buttonProgress: {
    backgroundColor: 'white',
    boxShadow: '0 0'
  },
  buttonSuccess: {
    backgroundColor: green[500],
  },
})


const SignupSchema = Yup.object().shape({
    account: Yup.string()
        .required('请输入学号')
        .matches(/^[0-9]+$/, '学号只包含数字')
        .length(13, '学号位数应该是13位的'),
    captcha: Yup.string().required('请输入验证码').length(6, '验证码有6位')
})

const RepeatPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .required('请输入新密码')
        .matches(
        /^[a-zA-Z0-9_]{5,}$/,
        '密码是只由数字、大小写字母、下划线组成的至少5位的字符串'
        ),
    repeatPassword: Yup.string()
        .required('请再次输入新密码')
        .oneOf([Yup.ref("password"), null], "两密码必须相等")
})

const BackwardButton = (props) => {
    
    const classes = useStyles()
    const [hovered, setHovered] = useState(true)
    //设置获取验证码的状态
    const [captchaAvailability,setCaptchaAvailability] = useState(true)
  
    const handleChange = () => {
        setHovered((prev) => !prev)
    }

    return (
        <Fab
        style={props.style}
        onClick={props.onClickEvent}
        type={props.type}
        >
            <ArrowBackIosIcon style={{
                position: 'relative',
                left: 'calc(50% - 14.43px)',
                height: '15px'
            }} />
        </Fab>
    )
}

const PasswordConf = (props) => {
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
  const [repeatPswVisibility, setRepeatPswVisibility] = useState(false)
  //设置页面滑动状态
  const [swiperIndex, setSwiperIndex] = useState(0)
  //设置密码修改是否成功
  const [success, setSuccess] = React.useState(false)
  
  const [regAccount, setRegAccount] = useState('')

  //设置swiper的元素引用
  const captcha = useRef(null)
  const classes = useStyles()
  //保存account的内容
  const [account,setAccount] = useState("")
  //设置倒计时
  const [clock,setClock ] = useState(0)
  //非状态的标示符
  let myClock = 0


 
  const fabClassName = clsx({
        [classes.buttonSuccess]: success,
        [classes.buttonProgress]: !success
  })
  
  //左侧轮播图的数据源
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

  //当clock小于等于0时，就清除定时器
  useEffect(()=>{
    if(clock <= 0 ){
       clearInterval(myInterval)
    }
    console.log(clock)
  },[clock])

  const postCaptchaEmail  = useCallback((errors,setFieldError,account)=>{
    if(typeof errors.account === 'undefined'){
       //如果没有错误
        Axios.post("/api/user/sendVerificationCode",{card:account})
        .then(res=>{
          if(res.result === 1){
               //说明邮件发送成功，就启动定时器，修改myclock
               myClock = 5
               setClock(5)
               myInterval =  setInterval(()=>{
                 myClock -= 1
                 setClock(myClock)
              },1000)
          }else{
            setMessage(res.msg)
            setFieldError('captcha', res.msg)
            setType('error')
            setOpen(true)
          }
       })
    }else{
       //如果有错误
      //  setFieldError("account","您的账号有误")
    }
  },[account,clock,setClock])

  const handleClickShowPassword = () => {
    setPasswordVisibility(!passwordVisibility)
  }

  const handleClickShowRepeatPassword = () => {
      setRepeatPswVisibility(!repeatPswVisibility)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const confirmPanel = (
    <div className='confirm-await-panel' style={{
        position: 'absolute',
        height: 'calc(100% - 70px)',
        width: 'calc(100% - 70px)',
        backgroundColor: 'white',
        opacity: '0.5',
        display: 'none',
        zIndex: 1000
    }}>
        <Fab style={{
            position: 'relative',
            left: 'calc(50% - 28px)',
            top: 'calc(50% - 28px)',
            zIndex: 1001
        }}
        className={fabClassName}
        >
            {success ? <CheckIcon /> : <CircularProgress />}
            
            <p className="confirm-panel-p"><span>
                
            </span></p>
        </Fab>
    </div>
  )

  const IDauthencateFormik = (
    <div>
        {confirmPanel}
        <div className="form-title">密码找回</div>
        <Formik
        initialValues={{
            account: '',
            password: '',
            identity: '0',
            captcha: '',
            cover: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setFieldError }) => {
            console.log(values)
            //校验验证码
            let res = await Axios.post('/api/user/checkVerificationCode', {
              veriCode: values.captcha,
            })
            //验证码验证成功
            if (res.result === 1) {
                confirmStatusChange(true)
                setRegAccount(values.account)
                let accountConfirmData = {
                    msg: "系统异常!",
                    result: 0
                }
                let confirmPromise = new Promise((resolve, reject) => {
                    Axios.post('/api/user/isExist', {
                        "card": values.account
                    }).then(res => {
                        accountConfirmData.msg = res.msg
                        accountConfirmData.result = res.result
                    })
                    setTimeout(resolve, 800)

                })
                confirmPromise.then(() => {
                    confirmStatusChange(false)
                    if (accountConfirmData.result == 1){
                        //success
                        setSwiperIndex(1)
                        values.captcha = ''
                    }
                    else {
                        setMessage(accountConfirmData.msg)
                        setFieldError('account', accountConfirmData.msg)
                        setType('error')
                        setOpen(true)
                        // changeCaptcha()
                    }
                    
                    
                })
            } else {
                setMessage('验证码不正确，请检查')
                setFieldError('captcha', res.msg)
                setType('error')
                setOpen(true)
                // changeCaptcha()
            }
        }}
        >
        {({ values,validateField,setFieldError,errors, touched, submitForm, handleSubmit, isSubmitting }) => {
            return (
            <form onSubmit={handleSubmit}>
                <Field
                classes={{
                    root: classes.fieldRoot,
                }}
                component={TextField}
                name="account"
                placeholder="输入您的账号"
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
                        {/* <img
                        alt="验证码"
                        ref={captcha}
                        onClick={changeCaptcha}
                        className="captcha"
                        /> */}
                          <Button href="" className={clock <= 0 && typeof errors.account === 'undefined' && values["account"]!==""? "success":"fail"} disabled={typeof errors.account === 'undefined'? false :true} onClick={()=>postCaptchaEmail(errors,setFieldError,values["account"])}>
                             {clock > 0 ? `获取验证码(${clock})`:`获取验证码` } 
                          </Button>
                    </InputAdornment>
                    ),
                }}
                />
                <Button
                variant="contained"
                className="login-button"
                type="submit"
                style={{marginTop: '20%'}}
                >
                找回密码
                </Button>
                <div className="register-link" onClick={()=>history.push('/login')}>返回登录</div>
            </form>
            )
        }}
        </Formik>
    </div>
  )

  const PasswordChangeFormik = (
    <div>
    {confirmPanel}
        <div className="form-title">密码找回</div>
        <Formik
        initialValues={{
            password: '',
            repeatPassword: ''
        }}
        validationSchema={RepeatPasswordSchema}
        onReset={(values) => {
            values.password = ''
            values.repeatPassword = ''
        }}
        onSubmit={async (values, { setFieldError }) => {
            console.log(regAccount)
            confirmStatusChange(true)
            let accountConfirmData = {
                msg: "系统异常!",
                result: 0
            }
            let confirmPromise = new Promise((resolve, reject) => {
                if (values.password === values.repeatPassword){
                    
                    Axios.post('api/user/setPassword', {
                        "card": regAccount,
                        "newPassword": values.password
                    }).then(res => {
                        accountConfirmData.msg = res.msg
                        accountConfirmData.result = res.result
                    })
                }
                else{
                    accountConfirmData.msg = '两次密码不一致!'
                    accountConfirmData.result = 0
                }
                setTimeout(resolve, 800)
            })
            confirmPromise.then(() => {
                if (accountConfirmData.result == 1){
                    //success
                    setSuccess(true)
                    setTimeout(() => {
                        history.push('/login')
                    }, 1000)
                }
                else {
                    confirmStatusChange(false)
                    setMessage(accountConfirmData.msg)
                    setFieldError('password', accountConfirmData.msg)
                    setType('error')
                    setOpen(true)
                }
            })
        }}
        >
        {({ errors, touched, submitForm, handleSubmit, isSubmitting, handleReset }) => {
            return (
            <form onSubmit={handleSubmit}>
                <Field
                component={TextField}
                name="password"
                placeholder="请输入新密码"
                style={{
                    marginTop: '15%'
                }}
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
                name="repeatPassword"
                placeholder="请再次输入新密码"
                InputProps={{
                    type: repeatPswVisibility ? 'text' : 'password',
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
                        onClick={handleClickShowRepeatPassword}
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
                <BackwardButton style={{
                    position: 'absolute',
                    left: '380px',
                    top: '25.5px',
                    height: '36px',
                    width: '36px',
                    backgroundColor: 'white',
                    boxShadow: '0 0'
                }}
                onClickEvent={() => {
                    setSwiperIndex(0)
                    // changeCaptcha()
                    handleReset()
                }}
                />
                <Button
                variant="contained"
                className="login-button"
                type="submit"
                style={{marginTop: '25%'}}
                >
                设置密码
                </Button>
                
            </form>
            )
        }}
        </Formik>
    </div>
  )

  //页面挂载去获取验证码
  // useEffect(() => changeCaptcha(), [])

  // const changeCaptcha = () => {
  //   Axios.get('/api/user/drawImage', {
  //     responseType: 'text',
  //   }).then((res) => {
  //       if(captcha.current != null){
  //           captcha.current.src = `data:image/jpg;base64,${res}`
  //       }
      
  //   })
  // }

  const confirmStatusChange = (state) => {
      let confirmPanels = document.getElementsByClassName('confirm-await-panel')
      for (let i = 0; i < confirmPanels.length; i++){
        confirmPanels[i].style.display = (state ? 'inline' : 'none')
      }
      
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
      <div className="title">REFUND</div>
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
        <SwipeableViews
        index={swiperIndex}
        onChangeIndex={() => {
            setSwiperIndex(
                (swiperIndex === 0) ? 1 : 0
            )
        }}
        className='form'
        >
            <div style={{
                overflow: 'hidden',
                padding: '35px'
            }}>
                {IDauthencateFormik}
            </div>
            <div style={{
                overflow: 'hidden',
                padding: '35px'
            }}>
                {PasswordChangeFormik}
            </div>
        </SwipeableViews>
        
        
        </div>
    </div>
  )
}

export default PasswordConf
