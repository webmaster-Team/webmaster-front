import React,{useState,useEffect} from 'react'
import { connect } from 'react-redux'
import { Card, Table, Avatar, Button } from 'antd'
import { actionCreators } from '../store'
import {useHistory} from 'react-router-dom'
import './style.styl'
const Inspect = props => {
  let history = useHistory()
  useEffect(() => {
    if(props.bookData.size === 0)
         history.replace('/index/borrow/check')
     props.changeStep(1)
  }, [])

    const columns = [
      {
        title: '书封',
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
        title: '书名',
        dataIndex: 'name',
        key: 'name',
      },
       {
         title: '作者',
         dataIndex: 'author',
         key: 'author',
      },
       {
         title: '出版社',
         dataIndex: 'publisher',
         key: 'publisher',
       },
      {
        title: '位置',
        dataIndex: 'place',
        key: 'place',
      },
    ]
    return (
      <div className="checkbookWrapper">
        <Card title="温馨提示" bordered={false} size="small" className="tipsCard">
          <p>
            请检查您的借阅信息，如果出现错误，请回退到上一步修改您的借阅信息.
          </p>
        </Card>
        <Table
          pagination={false}
          rowKey="table"
          className="table"
          dataSource={props.listData}
          columns={columns}
        />
        <div className="oprationbuttons">
          <Button onClick={()=>history.goBack()}>上一步</Button>
          <Button onClick={()=>history.push('/index/borrow/process')}>提交订单</Button>
        </div>
      </div>
    )
}

const mapState = (state) => ({
  bookData: state.borrow.get('bookData'),
  listData: state.borrow.get('listData'),
})
const mapDispatch = (dispatch) => ({
  changeStep() {
    dispatch(actionCreators.changeStep(1))
  },
})

export default connect(mapState, mapDispatch)(Inspect)
