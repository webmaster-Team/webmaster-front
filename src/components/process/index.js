import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Axios from '../../utils/request'
import { Card, Table, Avatar, Button, message, Tag } from 'antd'
import {actionCreators} from '../../pages/borrow/store'
import { withTheme } from 'styled-components'
import moment from 'moment'
import './style.styl'
class Process extends PureComponent {
  constructor(props) {
    super(props)
    this.dealBookData = this.dealBookData.bind(this)
    this.processStateToString = this.processStateToString.bind(this)
    this.borrow = this.borrow.bind(this)
    this.goHome = this.goHome.bind(this)
    this.state = {
      bookData: [],
      card: props.card,
    }
  }
  
  goHome () {
    this.props.history.push('/index/borrow/readrfid')
    this.props.resetBookData()
  }

  processStateToString(state) {
    switch (state) {
      case 0:
        return '未处理'
      case 1:
        return '正在处理'
      case 2:
        return '借阅成功'
      case -1:
        return '借阅失败'
    }
  }

  componentDidMount () {
    this.props.changeStep()
    let _self = this
    this.setState({ bookData: _self.dealBookData(_self.props.bookData) })
  }

  async borrow () {
    let _self = this
    this.state.bookData.map(async (item, index) => {
      //   // 设置当前处于正在处理的状态
      let dataList = _self.state.bookData.concat()
      dataList[index].status = 1
      _self.setState({ bookData: dataList })
      //正式处理
      let res = await Axios.post('/api/book/borrow', {
        bookid: parseInt(item.id),
        userid: parseInt(_self.props.id),
      })
      if (res.result === 1) {
          //处理成功状态
        dataList = _self.state.bookData.concat()
        dataList[index].status = 2
        dataList[index].revertDate = moment("" + res.data.borrowtime).add(res.data.duration,'d').format('YYYY-MM-DD')
        _self.setState({ bookData: dataList })
      } else {
        dataList = _self.state.bookData.concat()
        dataList[index].status = -1
        _self.setState({ bookData: dataList })
      }
    })
  }

  async componentDidUpdate(prevProps, prevState) {
    let _self = this
    if (this.state.bookData.length !== prevProps.bookData.length) {
      this.setState(
        { bookData: _self.dealBookData(_self.props.bookData) },
        async () =>await this.borrow()
      )
    }
  }

  //0代表未处理，1正在处理，2代表借阅成功，-1处理失败
  dealBookData(bookData) {
    // console.log(bookData)
    let _self = this
    let newBookData = []
    bookData.map((item, index) => {
      newBookData.push({
        key: item.key,
        id: item.id,
        name: item.name,
        status: 0,
        revertDate:''
      })
    })
    console.log(newBookData)
    return newBookData
  }

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '书名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '归还日期',
        dataIndex: 'revertDate',
        key: 'revertDate',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => {
          switch (text) {
            case 0:
              return <Tag color="#2db7f5">未处理</Tag>
            case 1:
              return <Tag color="#108ee9">正在处理</Tag>
            case 2:
              return <Tag color="#87d068">借阅成功</Tag>
            case -1:
              return <Tag color="#f50">借阅失败</Tag>
          }
        }
      },
    ]
    return (
      <div className="processWrapper">
        <Card title="温馨提示" bordered={false} size="small">
          <p>可能由于网络问题会出现卡慢的现象， 请耐心等待.</p>
        </Card>
        <Table
          pagination={false}
          rowKey="table"
          className="table"
          dataSource={this.state.bookData}
          columns={columns}
        />
        <div className="oprationbuttons">
          <Button onClick={this.goHome}>回到首页</Button>
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  bookData: state.getIn(['borrow', 'borrowBook']),
  id: state.getIn(['login', 'id']),
  step: state.getIn(['borrow', 'step']),
})
const mapDispatch = (dispatch) => ({
  resetBookData () {
    dispatch(actionCreators.commitTrueBorrowedBook([]))
    dispatch(actionCreators.commitBorrowedBooks([]))
  },
  changeStep () {
    dispatch(actionCreators.changeStep(2))
  },
})

export default connect(mapState, mapDispatch)(Process)
