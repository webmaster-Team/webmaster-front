import React, { PureComponent } from 'react'
import { Card, List, Avatar, Space, Button, Spin, Tag, message } from 'antd'
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import Axios from '../../utils/request'
import { actionCreators } from '../../pages/borrow/store'
import './style.styl'
import { Redirect } from 'react-router-dom'

class ReadRFID extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      listData: [],
      scanning: false,
      commit: false,
    }
    this.swapScanning = this.swapScanning.bind(this)
    this.bookStateToString = this.bookStateToString.bind(this)
    this.bookStateToColor = this.bookStateToColor.bind(this)
    this.cancelBorrow = this.cancelBorrow.bind(this)
    this.scan = this.scan.bind(this)
    this.commitBook = this.commitBook.bind(this)
  }

  componentDidMount() {
    if (this.props.bookData.length > 0)
      this.setState({ listData: this.props.bookData })
    this.props.changeStep()
  }

  swapScanning() {
    let _selt = this
    if (!this.state.scanning) {
      this.scan()
    }
    this.setState({ scanning: !this.state.scanning })
  }

  scan() {
    let _self = this
    //从RFID标签获得图书的ID
    let id = 1
    //发送post请求来获取该书的信息
    Axios.post('/api/book/searchbooks', {
      key: 1,
    }).then((res) => {
      console.log(res)
      if (res.result === 1) {
        let {
          author,
          cover,
          id,
          name,
          publisher,
          summary,
          state,
          iSBN,
        } = res.data[0]
        _self.setState({
          listData: _self.state.listData.concat([
            { author, cover, id, name, publisher, iSBN, summary, state },
          ]),
        })
      } else {
        message.error('该书本未找到或RFID标签已损坏')
      }
      this.setState({ scanning: false })
    })
  }

  bookStateToString(state) {
    switch (state) {
      case 1:
        return '可借'
      case 2:
        return '已借出'
      case -1:
        return '错误'
      case 0:
        return '不可借'
    }
  }

  commitBook() {
    this.props.commitBorrowBook(this.state.listData)
    this.setState({ commit: true })
  }

  bookStateToColor(state) {
    switch (state) {
      case 1:
        return '#87d068'
      case 2:
        return '#108ee9'
      case -1:
        return '#f50'
      case 0:
        return '#f50'
    }
  }

  cancelBorrow(index) {
    this.state.listData.splice(index, 1)
    let newListData = this.state.listData.concat()
    this.setState({ listData: newListData })
  }

  render() {
    const { borrow } = this.props
    if (this.state.commit) return <Redirect to="/index/borrow/checkBook/borrow" />
    return (
      <div className="readrfidWrapper">
        <Card title="温馨提示" bordered={false} size="small">
          <p>
            请在配备了RFID读卡器的计算机上使用，点击"扫描新图书"将您所需要操作的图书的侧面的RFID标签朝下以使得读卡器能够获取图书信息.
          </p>
          <p>您所扫描到的图书将会显示在下方的列表中.</p>
        </Card>
        <div className="operationBar">
          <span>
            还能借阅
            <span style={{ color: 'red' }}>
              {10 - borrow - this.state.listData.length}
            </span>
            本书
          </span>
          <Button
            type="primary"
            onClick={this.swapScanning}
            danger={this.state.scanning ? true : false}
            disabled={
              10 - borrow - this.state.listData.length > 0 ? false : true
            }
          >
            {this.state.scanning ? '取消扫入' : '扫入新图书'}
          </Button>
        </div>
        <Spin tip="正在扫描..." spinning={this.state.scanning}>
          <List
            bordered={true}
            itemLayout="vertical"
            size="large"
            dataSource={this.state.listData}
            footer={
              <div>
                <Button onClick={() => this.commitBook()}>下一步</Button>
              </div>
            }
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                actions={[
                  <Button
                    type="link"
                    danger
                    onClick={() => this.cancelBorrow(index)}
                  >
                    不借阅这本书
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
                      <Tag color={this.bookStateToColor(item.state)}>
                        状态:
                        {this.bookStateToString(item.state)}
                      </Tag>
                    </div>
                  }
                />
                {item.summary}
              </List.Item>
            )}
          />
        </Spin>
      </div>
    )
  }
}

const mapState = (state) => ({
  borrow: state.getIn(['login', 'borrow']),
  bookData: state.getIn(['borrow', 'bookData']),
})

const mapDispatch = (dispatch) => ({
  commitBorrowBook(listData) {
    dispatch(actionCreators.commitBorrowedBooks(listData))
  },
  changeStep() {
    dispatch(actionCreators.changeStep(0))
  },
})
export default connect(mapState, mapDispatch)(ReadRFID)
