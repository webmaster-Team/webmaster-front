import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Card, Table } from 'antd'
import './style.styl'
class CheckBook extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      type: props.match.params.type,
      text: props.match.params.type === 'borrow' ? '借阅' : '归还',
      bookData:
        props.type === 'borrow' ? props.borrowBookData : props.borrowBookData,
    }
  }

  render() {
    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
    ]
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
      },
    ]
    return (
      <div className="checkbookWrapper">
        <Card title="温馨提示" bordered={false} size="small">
          <p>
            请检查您的{this.state.text}
            信息，如果出现错误，请回退到上一步检查您的{this.state.text}信息.
          </p>
        </Card>
        <Table className="table" dataSource={dataSource} columns={columns} />
      </div>
    )
  }
}

const mapState = (state) => ({
  borrowBookData: state.getIn(['borrow', 'bookData']),
})
const mapDispatch = (dispatch) => ({})
export default connect(mapState, mapDispatch)(CheckBook)
