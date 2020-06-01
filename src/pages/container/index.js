/*
 * @Author: Daniel
 * @LastEditTime: 2020-05-30 16:39:08
 * @FilePath: /webmaster-front/src/pages/container/index.js
 */
import React, { useEffect, useCallback, useState } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import { Route, Redirect, Switch } from 'react-router-dom'
import { actionCreators as ac } from './store'
import {connect} from 'react-redux';
import SelfHeader from '../../components/header';
import Snackbar from '@material-ui/core/Snackbar';
import Borrow from '../borrow';
import './style.styl';
import Search from '../search';
import PersonalCenter from '../personalcenter';
import Renew from '../renew';

const {Header} = Layout;


const Container = (props) => {
  // 获取store中的数据
  let {select, login, showAlert, message, messageType} = props;


  return (
    <div>
      {/* 用于全局提供报错与提示的组件 */}
      <Snackbar
        className="snackbar"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        open={showAlert}
        onClose={() => props.modifyShowAlert(false, '', '')}
        autoHideDuration={2000}
        message={message}
      >
        <div
          className={
            'alert-wrapper ' + (messageType === 'success' ? 'success' : (messageType === 'error' ? 'error' : 'warning'))
          }
        >
          {message}
        </div>
      </Snackbar>
       <SelfHeader/>
       <div className="my-body">
          <Switch>
            <Route path="/index/search" component={Search}/>
            <Route path="/index/borrow" component={Borrow}/>
            <Route path='/index/usercenter' component={PersonalCenter}/>
            <Route path="/index/renew" component={Renew}/>
            <Redirect exact from="/index" to="/index/search"/>
          </Switch>
        </div>
    </div>
  )
}

const mapState = (state) => ({
  select: state.frame.get('select'),
  showAlert: state.frame.get('showAlert'),
  message: state.frame.get('message'),
  messageType: state.frame.get('messageType'),
})

const mapDispatch = (dispatch) => ({
  modifySelect(key) {
    dispatch(ac.modifySelect(key))
  },
  modifyLogin(state) {
    dispatch(ac.modifyLogin(state))
  },
  modifyUserInfo(info) {
    dispatch(ac.modifyUserInfo(info))
  },
  modifyShowAlert(show, message, type) {
    dispatch(ac.modifyShowAlert(show, message, type))
  },
})

export default connect(mapState, mapDispatch)(Container)
