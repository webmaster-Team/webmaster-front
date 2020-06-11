/*
 * @Author: Daniel
 * @LastEditTime: 2020-05-25 12:11:58
 * @FilePath: /webmaster-front/src/pages/personalcenter/Index.js
 */ 
/**
 * 一般呢，你们都看不懂我的代码
 */
import React,{useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom'
import {connect} from 'react-redux'
import { actionCreators as frameac } from '../container/store'
import Dialog from '@material-ui/core/Dialog';
import PhoneIcon from '@material-ui/icons/Phone'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Password from 'antd/lib/input/Password'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import FormLabel from '@material-ui/core/FormLabel'
import IconButton from '@material-ui/core/IconButton'
import MButton  from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { UploadOutlined } from '@ant-design/icons'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { Formik, Form, Field } from 'formik'
import Radio from '@material-ui/core/Radio'
import WcIcon from '@material-ui/icons/Wc'
import FaceIcon from '@material-ui/icons/Face'
import PanoramaIcon from '@material-ui/icons/Panorama'
import Config from '../../config'
import RightCard from './components/RightCard'
import {
    ManOutlined,WomanOutlined
  } from '@ant-design/icons';
import { Avatar,Card,Button,Upload } from 'antd';
import './style.styl'
import Token from '../../utils/token'
import Axios from '../../utils/request'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import { TextField, CheckboxWithLabel, RadioGroup } from 'formik-material-ui'
import Modal from 'react-bootstrap/Modal'
import { render } from 'react-dom';
import  BsButton  from 'react-bootstrap/Button'
let formInputColor = '#0182ff'


const SignupSchema = Yup.object().shape({
    nickname: Yup.string()
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
  })

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
    //   backgroundColor:formInputColor
       color: formInputColor
    },
  })

const  PersonalCenter = props=>{
    const classes = useStyles()
    let history = useHistory()
    const [open,setOpen] = useState(false)
    const handleClose = () => setOpen(false);
    const handleShow = () => setOpen(true);
    //设置文件上传的state
    const [fileList, setFileList] = useState([])
    //设置是否打开修改用户信息的对话框
    const [openDialog,setOpenDialog] = useState(false)
      //设置文件的返回头像的state
    const [avatarUrl, setAvatarUrl] = useState('')
     //设置密码可见性
     const [passwordVisibility, setPasswordVisibility] = useState(false)
    let {
      select,
      login, //记录用户的登录状态
      showAlert,
      message,
      messageType,
      name,
      card,
      cover,
      hasBorrowed,
      isBorrowing,
      step,
      identity,
      sex,
      email,
      phone,
      signTime
    } = props
    //验证是否登录
    console.log(props)

    const gridStyle = {
        width: '100%',
        textAlign: 'left',
    }

    const getUserData = ()=>{
        //如果内存里登录成功了，就可以直接获取数据了
        if (login || Token.validate()) {
            Axios.post('/api/user/getUserData', {}).then((res) => {
            if (res.result === 1) {
                props.modifyUserInfo({
                id: res.data.id,
                card: res.data.card,
                name: res.data.name,
                cover: res.data.cover,
                identity: res.data.identity,
                hasBorrowed: res.data.hasBorrowed,
                isBorrowing: res.data.isBorrowing,
                sex:res.data.sex,
                email:res.data.email,
                phone:res.data.phone,
                signTime:res.data.signTime
                })
            } else {
                props.modifyShowAlert(true, '获取您的信息失败', 'error')
            }
            })
            props.modifyLogin(true)
          }else{
            //并没有登陆
            history.replace('/login')
         } 
    }

    //如果login状态发生变化，就要重新查看是否有进入usercenter的权限
    useEffect(()=>{
       if(login || Token.validate()){
         getUserData()
       }else
          history.replace('/login')
    },[login])
    
   useEffect(() => {
      getUserData()
   }, [])

    //文件上传配置
    let uploadConfig = {
        name: 'portrait',
        multiple: false,
        listType: 'picture-card',
        method: 'post',
        action: `${Config.fileUploadBaseUrl}/api/user/upload`,
        beforeUpload: (file) => {
          return new Promise((resolve, reject) => {
            setFileList([file])
            const isJpgOrPng =
              file.type === 'image/jpeg' || file.type === 'image/png'
            if (!isJpgOrPng) {
              // message.error('你只能上传JPG/PNG文件!
              props.modifyShowAlert(true,'图片只支持jpeg、png','error')
              setAvatarUrl('')
            }
            const isLt2M = file.size / 1024 < 800
            if (!isLt2M) {
              // message.error('图片必须小于800KB!')
              props.modifyShowAlert(true,'图片必须小于800KB','error')
              setAvatarUrl('')
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
              props.modifyShowAlert(true,'头像上传成功','success')
            }
          } else if (status === 'error') {
            props.modifyShowAlert(true,'头像上传失败','error')
            setAvatarUrl('')
          }
        },
    }
    
    const handleClickShowPassword = () => {
         setPasswordVisibility(!passwordVisibility)
    }

    const handleMouseDownPassword = (event) => {
         event.preventDefault()
    }

    //关闭编辑用户信息的模态框
    const closeModifyUserInfoDialog = ()=>{
         setOpenDialog(false)
         setFileList([])  
    }

    return(
        <div className="personalCenterWrapper">
        <Button id="user_info_toggle" onClick={()=>setOpen(true)}><span>></span></Button>
        <Dialog
                open={openDialog}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
           >
            <DialogContent className="my">
                <DialogTitle id="alert-dialog-description">
                    编辑我的信息
                </DialogTitle>
                <DialogContentText id="alert-dialog-description" className="dialogBookText">
                <Formik
                    initialValues={{
                    nickname: props.nickname,
                    password: '',
                    sex: '',
                    phone: '',
                    cover: '',
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={async (values, { setFieldError }) => {
                        // console.log('发送验证码')
                        console.log(values)
                        //构建请求体
                        let postData = {
                            password: values.password,
                        }
                        if(typeof values.nickname !== 'undefined') postData.name = values.nickname
                        if (values.phone !== '') postData.phone = values.phone
                        if(values.sex !== "") postData.sex = parseInt(values.sex)
                        if (avatarUrl !== '') postData.cover = avatarUrl
                        let flag = false
                        if(Reflect.ownKeys(postData).length > 1)
                           flag = true
                        if(flag){
                             //发送请求
                            let res = await Axios.post('/api/user/update', postData)
                            //请求成功
                            if (res.result === 1) {
                                setOpenDialog(false)
                                props.modifyShowAlert(true,res.msg,'success')
                                setFileList([])  
                                getUserData()
                            } else {
                                props.modifyShowAlert(true,res.msg,'error')
                            }
                        }
                    }}
                >
                {({ errors, touched, submitForm, handleSubmit, isSubmitting }) => {
               return (
                 <form 
                  // onSubmit={handleSubmit}
                  >
                  <Field
                    classes={{
                      root: classes.fieldRoot,
                    }}
                    component={TextField}
                    name="nickname"
                    placeholder="输入您新的昵称"
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
                        classes={{
                          root: classes.fieldRoot,
                        }}
                        component={TextField}
                        name="phone"
                        placeholder="输入您新的联系电话"
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
                  <div className="forget-link-line">
                    <span className="forget-link">为了保护您的账户安全，请输入您的密码</span>
                  </div>
                  <MButton variant="contained" onClick={handleSubmit}  className="modifySubmitButton"  htmlType="submit" color="primary">
                    保存
                  </MButton>
                  <MButton color="primary" className="cancelButton" onClick={closeModifyUserInfoDialog}>
                    取消
                  </MButton>
                </form>
              )
                }}
                </Formik>
                 </DialogContentText>
                </DialogContent>
              </Dialog>
              {(
                document.body.clientWidth >= 768 ? (
                  <Card
                        className="infoBoard"
                        title={
                        <div className="avatarRow">
                            <Avatar className="avatar" size={64}  src={props.cover} />
                            <span className="name">{props.name}</span>
                            {
                                sex === 1?
                                    <ManOutlined className="sexIcon" style={{color:"#0182ff"}}/> :
                                    <WomanOutlined className="sexIcon" style={{color:"#FF69B4"}}/>
                            }
                        </div>
                        }
                  >
                    <Card.Grid style={gridStyle}>卡号 | {card}</Card.Grid>
                    <Card.Grid style={gridStyle}>身份 | {identity}</Card.Grid>
                    <Card.Grid style={gridStyle}>邮箱 | {typeof email == 'undefined' || email === ''? "未指定" : email}</Card.Grid>
                    <Card.Grid style={gridStyle}>电话 | {typeof phone == 'undefined' || phone === ''? "未指定" : phone}</Card.Grid>
                    <Card.Grid style={gridStyle}>第一次相遇 | {typeof signTime == 'undefined' || signTime === ''? "未指定" : signTime}</Card.Grid>
                    <Card.Grid style={gridStyle}>
                      已借阅 | {hasBorrowed} 本
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      正在借阅 | {isBorrowing} 本
                    </Card.Grid>
                    <Card.Grid style={gridStyle} className="modifyButtonLine">
                        <Button className="modifyButton" type="link" onClick={()=>setOpenDialog(true)}>编辑我的信息</Button>
                    </Card.Grid>
                  </Card>
                ):(
                  <div>
                    <Modal show={open} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>用户信息查看</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <Card
                            className="mini_infoBoard"
                            title={
                            <div className="avatarRow">
                                <Avatar className="avatar" size={48}  src={props.cover} />
                                <span className="name">{props.name}</span>
                                {
                                    sex === 1?
                                        <ManOutlined className="sexIcon" style={{color:"#0182ff"}}/> :
                                        <WomanOutlined className="sexIcon" style={{color:"#FF69B4"}}/>
                                }
                            </div>
                            }
                        >
                          <Card.Grid style={gridStyle}>卡号 | {card}</Card.Grid>
                          <Card.Grid style={gridStyle}>身份 | {identity}</Card.Grid>
                          <Card.Grid style={gridStyle}>邮箱 | {typeof email == 'undefined' || email === ''? "未指定" : email}</Card.Grid>
                          <Card.Grid style={gridStyle}>电话 | {typeof phone == 'undefined' || phone === ''? "未指定" : phone}</Card.Grid>
                          <Card.Grid style={gridStyle}>第一次相遇 | {typeof signTime == 'undefined' || signTime === ''? "未指定" : signTime}</Card.Grid>
                          <Card.Grid style={gridStyle}>
                            已借阅 | {hasBorrowed} 本
                          </Card.Grid>
                          <Card.Grid style={gridStyle}>
                            正在借阅 | {isBorrowing} 本
                          </Card.Grid>
                          <Card.Grid style={gridStyle} className="modifyButtonLine">
                              <Button className="modifyButton" type="link" onClick={()=>setOpenDialog(true)}>编辑我的信息</Button>
                          </Card.Grid>
                        </Card>
                      </Modal.Body>
                      <Modal.Footer>
                        <BsButton variant="primary" onClick={handleClose}>
                          关闭
                        </BsButton>
                      </Modal.Footer>
                    </Modal>
                  </div>
                )
              )
              }
             <div className="right-card-wrapper">
               <RightCard onOrderChange={()=>getUserData()}/>
             </div>
        </div>
    )
}


const mapState = (state) => ({
    login: state.frame.get('login'),
    showAlert: state.frame.get('showAlert'),
    message: state.frame.get('message'),
    messageType: state.frame.get('messsageType'),
    email:state.frame.get('email'),
    name: state.frame.get('name'),
    card: state.frame.get('card'),
    cover: state.frame.get('cover'),
    hasBorrowed: state.frame.get('hasBorrowed'),
    isBorrowing: state.frame.get('isBorrowing'),
    step: state.borrow.get('step'),
    identity: state.frame.get('identity'),
    sex:state.frame.get('sex'),
    phone:state.frame.get('phone'),
    signTime:state.frame.get('signTime')
  })
  
  const mapDispatch = (dispatch) => ({
    //修改用户的数据
    modifyUserInfo(info) {
      dispatch(frameac.modifyUserInfo(info))
    },
    modifyLogin(state) {
      dispatch(frameac.modifyLogin(state))
    },
    modifyShowAlert(show, message, type) {
      dispatch(frameac.modifyShowAlert(show, message, type))
    },
  })
  
  export default connect(mapState, mapDispatch)(PersonalCenter)