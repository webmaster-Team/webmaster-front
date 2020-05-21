import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Card, Table, Avatar, Button } from 'antd'
import { actionCreators } from '../../pages/borrow/store'
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
          : props.borrowBookData,
    }
  }

  componentDidMount() {
    this.props.changeStep()
  }

  componentWillUnmount() {
    this.props.commitTrueBorrowedBook(this.state.bookData)
  }

  goLastStep = () => {
    this.props.history.push('/index//borrow/readrfid')
  }

  goNextStep = () => {
    this.props.history.push('/index/borrow/process')
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
          <p>本页面只会保留显示你可以借阅的图书.</p>
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
})
const mapDispatch = (dispatch) => ({
  changeStep() {
    dispatch(actionCreators.changeStep(1))
  },
  commitTrueBorrowedBook(trueBookData) {
    dispatch(actionCreators.commitTrueBorrowedBook(trueBookData))
  },
})

export default connect(mapState, mapDispatch)(CheckBook)
