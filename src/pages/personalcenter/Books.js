/*
 * @Author: Daniel
 * @LastEditTime: 2020-05-28 14:27:33
 * @FilePath: /webmaster-front/src/pages/personalcenter/Books.js
 */ 
import React, { useState }         from 'react'
import { BookOutlined }             from '@ant-design/icons'
import { Collapse, Card, Button, Descriptions } from 'antd';

const { Panel } = Collapse;
const bookConfig = require('./conf/book.json')
/**
 * @todo testProps are going to deleted
 */
const testProps = "test"
const testOrder = [
    {
        id: "10001",
        label: "xxx等5本书",
        "status": "已完成"
    },
    {
        id: "10002",
        label: "xxx等5本书",
        "status": "已完成"
    }
]
let testBooks = [
    {
        id: "10001",
        name: "XXXXXX",
        author: "Daniel",
        publisher: "人民日报",
        headImgSrc: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
    }
]
for (let i = 0; i < 12; i++){
    testBooks.push(testBooks[0])
}

export default function CenterBooks(){

    const [state, setState] = useState(
        {
            borrowedBooks: testBooks,
            orders: testOrder,
            returnedBooks: testBooks
        }
    )

    /**
     * @description 订单样式
     */
    let orderGridStyle = {
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: '15px 40px'
    };

    /**
     * @description 书单样式
     */
    let bookGridStyle = {
        width: '20%',
        textAlign: 'left',
    };

    /**
     * @description 订单列表
     */
    let OrderCollapse = (
        <Panel header="已生成书单" key="order">
            {/** @todo testprops are going to deleted */}
            {state.orders.map(order => {
                return (
                    renderOrder(order)
                )
            })}
        </Panel>
    )

    /**
     * @description 已借书籍列表
     */
    let BorrowedCollapse = (
        <Panel header="已借书籍" key="borrowed">
            {/** @todo testprops are going to deleted */}
            {state.borrowedBooks.map(book => {
                return (
                    renderBook(book)
                )
            })}
        </Panel>
    )

    /**
     * @description 已归还书籍列表
     */
    let ReturnedCollapse = (
        <Panel header="已归还书籍" key="returned">
            {/** @todo testprops are going to deleted */}
            {state.returnedBooks.map(book => {
                return (
                    renderBook(book)
                )
            })}
        </Panel>
    )

    /**
     * @description 返回单条订单的grid
     */
    function renderOrder(order) {
        return (
            <Card.Grid style={orderGridStyle}>
                <BookOutlined />
                <div>
                    {order.label}
                </div>
                <div style={{marginLeft: '40%'}}>
                    {"编号:" + order.id}
                </div>
                <div>
                    {"状态:" + order.status}
                </div>
                <Button type="primary" shape="round" size="small">
                    取消预约
                </Button>
            </Card.Grid>
        )
    }

    /**
     * @description 返回单本书籍信息的grid
     */

    function renderBook(book){
        return (
            <Card.Grid style={bookGridStyle} key={book.id} className="book-info-card">
                <img src={book.headImgSrc} style={{height: '100%', width: '100%', padding: '5'}} />
                <p><span>书名:</span>{book.name}</p>
                <p><span>作者:</span>{book.author}</p>
                <p><span>出版社:</span>{book.publisher}</p>
            </Card.Grid>
        )
    }
    
    return(
        <div className="center-layout-div">
            <Collapse defaultActiveKey={['1']}>
                {OrderCollapse}
                {BorrowedCollapse}
                {ReturnedCollapse}
            </Collapse>
        </div>
    )

}