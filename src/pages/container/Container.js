import React, { PureComponent } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons'
import SelfHeader from '../../components/header/SelfHeader'
import Borrow from '../borrow'
import './style.less'
import Token from '../../utils/token'
import {actionCreators} from './store'
const { SubMenu } = Menu
const { Content, Sider } = Layout

class Container extends PureComponent {
  state = {
    collapsed: false,
  }

  componentDidMount () {
    console.log(this.props.history)
    // if (!Token.validate())
    //    this.props.history.push('/login')
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  render () {
    let { select } = this.props
    let _select = select=== "" ? "search" : select
    if (!Token.validate()) return <Redirect to="/login" />
    return (
      <Layout style={{ minHeight: '100%' }}>
        <SelfHeader />
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              onClick={({ item, key })=>this.props.changeSelect(key)}
              mode="inline"
              defaultSelectedKeys={[_select]}
              selectedKeys={[_select]}
              defaultOpenKeys={['sub1']}
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
          <Layout style={{ padding: '0 24px 24px' }}>
            <Redirect from="/index" to="/index/borrow"/>
            <Route path="/index/borrow" component={Borrow} />
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

const mapState = (state) => ({
   select: state.getIn(['frame', 'select']),
})

const mapDispatch = (dispatch) => ({
  changeSelect (select) {
    dispatch(actionCreators.changeSelect(select))
  }
})
export default connect(mapState, mapDispatch)(Container)
