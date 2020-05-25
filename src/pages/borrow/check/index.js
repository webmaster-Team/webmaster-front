import React, { useEffect, useState } from 'react'
import { Card, List, Avatar, Space, Button, Spin, Tag, message } from 'antd'
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { actionCreators as frameac} from '../../container/store'
import Axios from '../../../utils/request'
import axios from 'axios'
import { actionCreators } from '../store'
import './style.styl'
import { Redirect,useHistory } from 'react-router-dom'

const Check = (props) => {
  const history = useHistory()
  const [listData, setListData] = useState([]) //列表数据
  let { isBorrowing, bookData } = props //获取redux中的数据
  //进入后首先将select设置为1，获取从搜索产生的待借阅的图书
  useEffect(() => {
    props.changeStep(0)
    let newListData = listData.concat()
    let axioses = []
    bookData.map((item, index) => {
      axioses.push(
        Axios.post('/api/book/searchBookData', {
          bookId: parseInt(item),
        })
      )
    })
    //封装了两个并行请求
    Axios.all(axioses).then(axios.spread((...res) => {
      let resListData = []
      res.forEach(value => resListData.push(value.data))
       setListData(resListData)
    }))

  }, [])

  //按照书的状态生成字符串
  const bookStateToString = (state) => {
    if (state >= 1)
      return '可借'
    else
      return '不可借'
  }

  //按照书的状态生成颜色
  const bookStateToColor = (state) => {
    if (state >= 1)
      return '#87d068'
    else 
      return '#f50'
    // switch (state) {
    //   case 1:
    //     return '#87d068'
    //   case 2:
    //     return '#108ee9'
    //   case -1:
    //     return '#f50'
    //   case 0:
    //     return '#f50'
    // }
  }

  //对某一本书取消借阅
  const cancelBorrow = (index) => {
    let newListData = listData.concat()
    newListData.splice(index, 1)
    setListData(newListData)
    let newBookData = bookData.concat()
    newBookData.splice(index, 1)
    props.commitBorrowBook(newBookData)
  }

  //提交图书
  const commitBook = () => {
    props.modifyListData(listData)
    history.push('/index/borrow/inspect')
  }

  return (
    <div className="readrfidWrapper">
      <Card title="温馨提示" bordered={false} size="small">
        <p>
          请在下方操作您要借阅的图书，如果您希望添加新图书，请前往“搜索”页面来添加新图书。
        </p>
        <p>
          您当前还有{isBorrowing}本书在借阅中，建议您先归还图书，再进行借阅。
        </p>
      </Card>
      <List
        className="list"
        bordered={true}
        itemLayout="vertical"
        size="large"
        dataSource={listData}
        footer={
          <div>
            <Button onClick={() => commitBook()}>下一步</Button>
          </div>
        }
        renderItem={(item, index) => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                type="link"
                danger
                onClick={() => cancelBorrow(index)}
              >
                取消借阅
              </Button>,
            ]}
            extra={<img width={272} alt="图书的图片" src={item.cover} />}
          >
            <List.Item.Meta
              title={<div>{item.name}</div>}
              description={
                <div>
                  <Tag>ID:{item.id}</Tag>
                  <Tag>ISBN:{item.iSBN}</Tag>
                  <Tag>作者:{item.author}</Tag>
                  <Tag>出版:{item.publisher}</Tag>
                  <Tag color={bookStateToColor(item.state)}>
                    状态:
                    {bookStateToString(item.state)}
                  </Tag>
                </div>
              }
            />
            {item.summary}
          </List.Item>
        )}
      />
    </div>
  )
}

const mapState = (state) => ({
  isBorrowing: state.frame.get('isBorrowing'),
  bookData: state.borrow.get('bookData'),
})

const mapDispatch = (dispatch) => ({
  commitBorrowBook(bookData) {
    dispatch(actionCreators.commitBorrowedBooks(bookData))
  },
  changeStep() {
    dispatch(actionCreators.changeStep(0))
  },
  modifyListData(listData) {
    dispatch(actionCreators.modifyListData(listData))
  },
  modifyShowAlert(show, message, type) {
    dispatch(frameac.modifyShowAlert(show, message, type))
  },
})

export default connect(mapState, mapDispatch)(Check)
