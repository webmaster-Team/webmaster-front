import React, { useEffect, useCallback } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import { Route, Redirect } from 'react-router-dom'
import { useDispatch, useMappedState } from 'redux-react-hook'
import { actionCreators as ac } from './store'
import { StoreContext } from 'redux-react-hook'
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons'
// import SelfHeader from '../../components/header/SelfHeader'
// import Borrow from '../borrow'
import './style.less'
// import Token from '../../utils/token'
const { SubMenu } = Menu
const { Content, Sider } = Layout

const Container = (props) => {
  //主动连接store
  // const store = useContext(StoreContext)
  //设置store数据映射
  const mapState = useCallback(
    (state) => ({
      select: state.frame.select,
    }),
    []
  )
  // 获取store中的数据
  const { select } = useMappedState(mapState)
  // 从store中读取dispatch
  const dispatch = useDispatch()

  //修改store中的select数据的action
  const modifySelect = (key) => {
    dispatch(ac.modifySelect(key))
  }

  return (
    <Layout style={{ minHeight: '100%' }}>
      {/* <SelfHeader /> */}
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            onClick={({ key }) => modifySelect(key)}
            mode="inline"
            defaultSelectedKeys={[select]}
            selectedKeys={[select]}
            style={{ height: '100%', borderRight: 0 }}
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
        </Sider>
      </Layout>
    </Layout>
  )
}

export default Container
