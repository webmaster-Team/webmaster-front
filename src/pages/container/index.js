import React, { useEffect, useCallback, useState } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import { Route, Redirect } from 'react-router-dom'
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
import { isValid } from 'date-fns/esm'
import { useHistory } from 'react-router-dom'
import resolve from 'resolve'
import Search from '../search'
import Axios from '../../utils/request'
// import Token from '../../utils/token'
const { SubMenu } = Menu
const { Content, Sider } = Layout

const Container = (props) => {
  //引入路由历史
  let history = useHistory()
  // 获取store中的数据
  let { select, login, showAlert, message, messageType } = props
  //设置select_array state
  let [selectArray, setSelectArray] = useState([select])
  const modifySelectArray = useCallback(() => {
    setSelectArray([select])
  }, [select])
  //手动修改store中的select数据的action
  const modifySelect = (key) => {
    props.modifySelect(key)
    history.push(`/index/${key}`)
  }
  //刚挂载页面时验证是否登录
  useEffect(() => {
    console.log(props)
    if (props.location.search !== '') {
      //说明是由第三方登录进来的，这个链接只有可能是通过第三方登录进来的
      let token_array = props.location.search
        .split('?')[1]
        .split('&')[0]
        .split('=')
      if (token_array[0] === 'token') {
        if (Token.validate()) {
          //如果本地校验成功，说明本地还有用户登录着，那就啥也不干
        } else {
          //本地没有token，那就设置一个token
          Token.set(token_array[1]) //设置token
        }
        //为了token的安全性，重定向到/index
        history.replace('/index')
      }
    } else {
      //普通路由进入
      let token_validate_result = Token.validate()
      // debugger
      if (token_validate_result) {
        console.log('已登录')
        //修改login标识符
        props.modifyLogin(true)
        //如果验证成功，说明在登录状态
        getUserData().then((res) => {
          if (res.result === 1) {
            console.log('成功获取用户数据')
            //说明获取成功
            props.modifyUserInfo({
              id: res.data.id,
              card: res.data.card,
              name: res.data.name,
              cover: res.data.cover,
              identity: res.data.identity,
              borrow: res.data.borrow,
            })
          } else {
            props.modifyShowAlert(true, '获取您的信息失败', 'error')
          }
        })
      } else {
        console.log('未登录')
        //验证失败，无人登录
        props.modifyLogin(false)
      }
    }
  }, [])

  //获取用户的数据，返回一个promise
  const getUserData = () => {
    return Axios.post('/api/user/getUserData', {})
  }

  return (
    <Layout style={{ minHeight: '100%' }}>
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
        {/* <Sider width={200} className="site-layout-background">
          <Menu
            onClick={({ key }) => modifySelect(key)}
            mode="vertical"
            defaultSelectedKeys={[props.location.pathname.split('/')[2]]}
          >
            <Menu.ItemGroup key="g1" title="搜索">
              <Menu.Item key="search">搜索</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup key="g2" title="图书服务">
              <Menu.Item key="borrow">借书</Menu.Item>
              <Menu.Item key="invert">还书</Menu.Item>
              <Menu.Item key="renew">续借</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup key="g3" title="个人服务">
              <Menu.Item key="userCenter">个人中心</Menu.Item>
            </Menu.ItemGroup>
          </Menu>
        </Sider> */}
        <div>
          {/* <Redirect path="/index" exact to="/index/search" /> */}
          <Route path="/index/search" component={Search} />
          <Route path="/index/borrow" component={Borrow} />
        </div>
      </Layout>
    </Layout>
  )
}

const mapState = (state) => ({
  select: state.frame.get('select'),
  login: state.frame.get('login'),
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
