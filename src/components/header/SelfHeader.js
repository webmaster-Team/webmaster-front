import React from 'react';
import screenfull from 'screenfull';
import {message, Menu, Avatar} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined
} from '@ant-design/icons';

import {withRouter} from 'react-router-dom';

import EditPasswordModal from './EditPasswordModal';
import EditInfoModal from './EditInfoModal';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullscreen: false,    //控制页面全屏
      infoVisible: false,     //控制修改用户信息的模态框
      passwordVisible: false   //控制修改密码的模态框
    };
  }

  // /**
  //  * 切换侧边栏的折叠和展开
  //  */
  // toggleCollapsed = () => {
  //   this.props.onChangeState({
  //     collapsed: !this.props.collapsed
  //   })
  // }
  /**
   * 切换全屏
   */
  toggleFullscreen = () => {
    if (screenfull.enabled) {
      screenfull.toggle().then(() => {
        this.setState({
          isFullscreen: screenfull.isFullscreen
        });
      });
    }
  };


  /**
   * 展开/关闭修改信息模态框
   */
  toggleInfoVisible = (visible) => {
    this.setState({
      infoVisible: visible
    });
  };
  /**
   * 展开/关闭修改密码模态框
   */
  togglePasswordVisible = (visible) => {
    this.setState({
      passwordVisible: visible
    });
  };


  render() {
    const {isFullscreen, infoVisible, passwordVisible} = this.state;

    return (
      <div style={{background: '#fff', padding: '0 16px'}}>
        {React.createElement(this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: this.toggleCollapsed
        })}
        <div style={styles.headerRight}>
          <div style={styles.headerItem}>
            <Menu mode="horizontal" selectable={false}>
              <SubMenu title={<div style={styles.avatarBox}><Avatar size='small'
                                                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>&nbsp;
                <span>Ali_Ming</span></div>}>
                <MenuItemGroup title="用户中心">
                  <Menu.Item key={1} onClick={() => this.toggleInfoVisible(true)}><UserOutlined/>编辑个人信息</Menu.Item>
                  <Menu.Item key={77} onClick={() => this.togglePasswordVisible(true)}><EditOutlined/>修改密码</Menu.Item>
                  <Menu.Item key={2}><LogoutOutlined/>退出登录</Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup title="设置中心">
                  <Menu.Item key={3} onClick={this.toggleFullscreen}>{isFullscreen ? <FullscreenExitOutlined/> :
                    <FullscreenOutlined/>}切换全屏</Menu.Item>
                </MenuItemGroup>
              </SubMenu>
            </Menu>
          </div>
        </div>
        <EditInfoModal toggleVisible={this.toggleInfoVisible} visible={infoVisible}/>
        <EditPasswordModal toggleVisible={this.togglePasswordVisible} visible={passwordVisible}/>
      </div>
    );
  }
}

const styles = {
  headerRight: {
    float: 'right',
    display: 'flex',
    height: 64,
    marginRight: 50
  },
  headerItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px'
  },
  avatarBox: {
    display: 'flex',
    alignItems: 'center'
  }
};

export default withRouter(MyHeader);
