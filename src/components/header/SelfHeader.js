import React, {Component} from 'react';
import {Layout} from 'antd';
import title from '../../assets/img/title.png';
import head from '../../assets/img/head.svg';
import {HeaderLogo, HeaderWrapper} from './style';
import {Menu, Dropdown} from 'antd';

const {Header} = Layout;


const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        个人详情
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        图书管理
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        退出登录
      </a>
    </Menu.Item>
  </Menu>
);

const DropdownMenu = () => {
  return (
    <Dropdown key="more" overlay={menu}>
      <img src={head} alt='header'/>
    </Dropdown>
  );
};

class SelfHeader extends Component {
  render() {
    return (
      <Header className="header">
        <HeaderWrapper>
          <HeaderLogo>
            <img src={title} alt={'logo'}/>
          </HeaderLogo>
          <DropdownMenu/>
        </HeaderWrapper>
      </Header>
    );
  }
}

export default SelfHeader;
