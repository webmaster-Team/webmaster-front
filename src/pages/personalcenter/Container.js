/*
 * @Author: Daniel
 * @LastEditTime: 2020-05-28 14:34:44
 * @FilePath: /webmaster-front/src/pages/personalcenter/Container.js
 */ 
import  React, { Component }         from 'react'
import  { Layout, Menu, Dropdown }   from 'antd'
import  head                         from '../../assets/img/head.svg';
import  title                        from '../../assets/img/title.png';
import  Info                         from './Info'
import  Books                        from './Books'
const   imgConfig                   = require('./conf/imgs.json')
const   menuConfig                  = require('./conf/menu.json')

const { Header, Content } = Layout;

const personalMenu = (
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

export default function Container(props){
    console.log(imgConfig)
    let topButtonGroup = menuConfig.items.map(element => (
        <Menu.Item >
            <a target="_blank" rel="noopener noreferrer" href={element.url}>
                {element.name}
            </a>
        </Menu.Item>
    ))
    let DropdownMenu = (
        <Dropdown key="more" overlay={topButtonGroup}>
            <img src={head} alt='header'/>
        </Dropdown>
    );
    return(
        <Layout className="center-layout" >
            <Header>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item>
                        {/* 校徽,标题 */}
                        <img id="crest" src={imgConfig.crest.url} />    
                        <img id="title" src={title} />
                    </Menu.Item>
                    {topButtonGroup}
                </Menu>
            </Header>
            <Content className="center-content">
                <div className="center-content-layout">
                    <Layout className="center-content-layout-info" style={{padding: '10px 10px'}}>
                        <Info />
                    </Layout>
                    <Layout className="center-content-layout-books" style={{padding: '9px 50px'}}>
                        <Books />
                    </Layout>
                </div>
            </Content>
        </Layout>
    )
}