import React from 'react'

const End = props => {
    return (
        <div className="endWrapper">
            <div className="endTitle"></div>
             {/* <Table
                pagination={false}
                rowKey="table"
                className="table"
                dataSource={props.listData}
                columns={columns}
             /> */}
        </div>
   )
}



const mapState = (state) => ({
    isBorrowing: state.frame.get('isBorrowing'),
    bookData: state.borrow.get('bookData'),
})

const mapDispatch = (dispatch) => ({
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

export default connect(mapState, mapDispatch)(End)
