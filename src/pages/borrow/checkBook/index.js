import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Card, Table, Avatar, Button } from 'antd'
import { actionCreators } from '../store'
import { actionCreators as invertActionCreators } from '../../invert/store'
import './style.styl'
class CheckBook extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      type: props.match.params.type,
      text: props.match.params.type === 'borrow' ? '借阅' : '归还',
      bookData:
        props.match.params.type === 'borrow'
          ? this.grepBookData(props.borrowBookData)
          : this.grepBookData(props.invertBookData),
    }
  }

  componentDidMount () {
    if(this.state.type === 'borrow')
      this.props.changeStep()
    else if (this.state.type === 'invert')
      this.props.changeInvertStep()
  }

  componentWillUnmount () {
       if (this.state.type === 'borrow') this.props.commitTrueBorrowedBook(this.state.bookData)
       else if (this.state.type === 'invert') this.props.commitTrueInvertBook(this.state.bookData)
  }

  goLastStep = () => {
     if (this.state.type === 'borrow')
          this.props.history.push('/index/borrow/readrfid/borrow')
     else if (this.state.type === 'invert')
         this.props.history.push('/index/invert/readrfid/invert')
  }

  goNextStep = () => {
     if (this.state.type === 'borrow')
      this.props.history.push('/index/borrow/process/borrow')
     else if (this.state.type === 'invert')
       this.props.history.push('/index/invert/process/invert')
  }

  //处理bookdata，将一些state不是1的图书都剔除
  grepBookData(preprocessData) {
    let processData = []
    preprocessData.forEach((item, index) => {
      console.log(item)
      if (item.state === 1) {
        processData.push({
          key: '' + index,
          id: item.id,
          isbn: item.iSBN,
          name: item.name,
          cover: item.cover,
        })
      }
    })
    console.log(processData)
    return processData
  }

  render() {
    const columns = [
      {
        title: '书面',
        dataIndex: 'cover',
        key: 'cover',
        render: (text, record, index) => <Avatar src={text} />,
      },
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'ISBN编码',
        dataIndex: 'isbn',
        key: 'isbn',
      },
      {
        title: '书名',
        dataIndex: 'name',
        key: 'name',
      },
    ]
    return (
      <div className="checkbookWrapper">
        <Card title="温馨提示" bordered={false} size="small">
          <p>
            请检查您的{this.state.text}
            信息，如果出现错误，请回退到上一步检查您的{this.state.text}信息.
          </p>
          <p>本页面只会保留显示你可以${this.state.text}的图书.</p>
        </Card>
        <Table
          pagination={false}
          rowKey="table"
          className="table"
          dataSource={this.state.bookData}
          columns={columns}
        />
        <div className="oprationbuttons">
          <Button onClick={this.goLastStep}>上一步</Button>
          <Button onClick={this.goNextStep}>开始处理</Button>
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  borrowBookData: state.getIn(['borrow', 'bookData']),
  invertBookData: state.getIn(['invert', 'bookData']),
})
const mapDispatch = (dispatch) => ({
  changeStep() {
    dispatch(actionCreators.changeStep(1))
  },
  commitTrueBorrowedBook(trueBookData) {
    dispatch(actionCreators.commitTrueBorrowedBook(trueBookData))
  },
  changeInvertStep() {
    dispatch(invertActionCreators.changeStep(1))
  },
  commitTrueInvertBook(trueBookData) {
    dispatch(invertActionCreators.commitTrueInvertBook(trueBookData))
  },
})

export default connect(mapState, mapDispatch)(CheckBook)
