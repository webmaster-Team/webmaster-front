import React, { useState, useEffect } from 'react'
import {actionCreators as frameac} from '../../pages/container/store'
import {connect} from 'react-redux'
import { Avatar,Button } from 'antd';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import './style.styl'
import HZNUImg from '../../assets/img/hznu.png'
import {useHistory} from 'react-router-dom'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import { useEventCallback } from '@material-ui/core';
import Token from '../../utils/token'
const Header = props=>{
  const history = useHistory()
  //存储是否显示用户信息的下拉菜单
  const [open,setOpen] = useState(false)

  //退出当前账号的业务逻辑
  const handleLogout = ()=>{
    Token.fail()
    props.modifyLogin(false)
  }

   return (
     <div className="header-wrapper">
       <div className="header-logo" onClick={()=>history.push('/index/search')}>
         <img src={HZNUImg} width={70} /> 
         <span className="header-logo-text">COMT-LIBRARY</span>
      </div>
      <ul className="header-router">
        <li onClick={()=>history.push('/index/search')}>寻找</li>
        <li onClick={()=>history.push('/index/borrow')}>借阅</li>
        <li onClick={()=>history.push('/index/renew')}>续借 / 归还</li>
      </ul>
      <div className="header-user-info">
         {
           !props.login ? 
           <ul className="header-user-login-register">
               <li onClick={()=>history.push('/login')}>登录</li>
               <li>/</li>
               <li onClick={()=>history.push('/register')}>注册</li>
           </ul>:
           (
             <div className="header-avatar-wrapper" 
                  onMouseEnter={()=>setOpen(true)} 
                  onMouseLeave={()=>setOpen(false)}>
                  <Avatar src={props.cover} />
                  <span className="header-avatar-name">{props.name}</span>
                  <ArrowDropDownIcon className="header-avatar-dropdown-icon"/>
                  {
                    open? 
                    (
                      <div className="user-info-board"
                           onMouseEnter={()=>setOpen(true)} 
                           onMouseLeave={()=>setOpen(false)}>
                        <ul className="user-info-board-list">
                           <li onClick={()=>history.push('/index/usercenter')}>
                             <SettingsIcon className="user-info-board-list-li-icon"/><span>用户中心</span>
                           </li>
                           <li onClick={handleLogout}>
                             <ExitToAppIcon  className="user-info-board-list-li-icon"/>
                             <span>退出</span>
                           </li>
                        </ul>
                      </div>
                    ):null
                  }
            </div>
           )
         }
      </div>
     
     
     </div>
   )
}

const mapState = (state) => ({
  login:state.frame.get('login'),
  select: state.frame.get('select'),
  showAlert: state.frame.get('showAlert'),
  message: state.frame.get('message'),
  messageType: state.frame.get('messageType'),
  name: state.frame.get('name'),
  card: state.frame.get('card'),
  cover: state.frame.get('cover'),
})

const mapDispatch = (dispatch) => ({
  modifySelect(key) {
    dispatch(frameac.modifySelect(key))
  },
  modifyLogin(state) {
    dispatch(frameac.modifyLogin(state))
  },
  modifyUserInfo(info) {
    dispatch(frameac.modifyUserInfo(info))
  },
  modifyShowAlert(show, message, type) {
    dispatch(frameac.modifyShowAlert(show, message, type))
  },
})

export default connect(mapState, mapDispatch)(Header)
