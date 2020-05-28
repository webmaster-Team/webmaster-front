import React, { useEffect, useCallback, useState } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import { Route, Redirect, Switch } from 'react-router-dom'
import { actionCreators as ac } from './store'
import { connect } from 'react-redux'
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons'
import SelfHeader from '../../components/header/SelfHeader'
import Token from '../../utils/token'
import Snackbar from '@material-ui/core/Snackbar'
import Borrow from '../borrow'
import './style.styl'
import Search from '../search'

const Container = (props) => {
  // 获取store中的数据
  let { select, login, showAlert, message, messageType } = props

  return (
    <Layout style={{ minHeight: '100%' }}>
      {/* 用于全局提供报错与提示的组件 */}
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={showAlert}
        onClose={() => props.modifyShowAlert(false, '', '')}
        autoHideDuration={2000}
        message={message}
      >
        <div
          className={
            'alert-wrapper ' + (messageType === 'success' ? 'success' : 'error')
          }
        >
          {message}
        </div>
      </Snackbar>
      <SelfHeader />
      <Layout>
        <div>
          {/* <Redirect path="/index" exact to="/index/search" /> */}
          <Switch>
            <Route path="/index/search" component={Search} />
            <Route path="/index/borrow" component={Borrow} />
            <Redirect exact from="/index"  to="/index/search"/>
          </Switch>
        </div>
      </Layout>
    </Layout>
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
