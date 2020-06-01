import React from 'react'
import {actionCreators as frameac} from '../../pages/container/store'
import {connect} from 'react-redux'
import { Avatar,Button } from 'antd';
import './style.styl'
import HZNUImg from '../../assets/img/hznu.png'
import {useHistory} from 'react-router-dom'
const Header = props=>{
  const history = useHistory()
   return (
     <div className="header-wrapper">
       <div className="header-logo">
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
             <div>
               <div className="header-avatar">
                  <Avatar src={props.cover} />
               </div>
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
