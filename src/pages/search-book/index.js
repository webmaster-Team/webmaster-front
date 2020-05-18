import React, {Component} from 'react';
import {Input, Tag, Card} from 'antd';

import {SearchOutlined} from '@ant-design/icons';
import './style.styl';

const {Meta} = Card;
const {Search} = Input;

class SearchBook extends Component {
  render() {
    return (
      <div className='w-search'>
        <div className='search-tab'>
          <Search placeholder="请输入您要搜索的内容" onSearch={value => console.log(value)} enterButton/>
        </div>
        <div className='search-title'>
          <Tag icon={<SearchOutlined/>} color="#55acee" className='tag-search-title'>
            查询结果
          </Tag>
        </div>
        <div className='c-search'>

          <div className='search-list'>
            <Card
              hoverable
              style={{flex: '1', margin: '0 20px 20px 0', maxWidth: '160px'}}
              cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
            >
              <Meta title="Europe Street beat" description="www.instagram.com"/>
            </Card>
            <Card
              hoverable
              style={{flex: '1', margin: '0 20px 20px 0', maxWidth: '160px'}}
              cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
            >
              <Meta title="Europe Street beat" description="www.instagram.com"/>
            </Card>
            <Card
              hoverable
              style={{flex: '1', margin: '0 20px 20px 0', maxWidth: '160px'}}
              cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
            >
              <Meta title="Europe Street beat" description="www.instagram.com"/>
            </Card>
            <Card
              hoverable
              style={{flex: '1', margin: '0 20px 20px 0', maxWidth: '160px'}}
              cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
            >
              <Meta title="Europe Street beat" description="www.instagram.com"/>
            </Card>
            <Card
              hoverable
              style={{flex: '1', margin: '0 20px 20px 0', maxWidth: '160px'}}
              cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
            >
              <Meta title="Europe Street beat" description="www.instagram.com"/>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBook;
