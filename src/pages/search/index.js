import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import {useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import Divider from '@material-ui/core/Divider'
import { Select, DatePicker, Input,Affix,Anchor,BackTop } from 'antd'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DirectionsIcon from '@material-ui/icons/Directions'
import SettingsIcon from '@material-ui/icons/Settings'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CloseIcon from '@material-ui/icons/Close'
import CardMedia from '@material-ui/core/CardMedia'
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle'
import Typography from '@material-ui/core/Typography'
import { actionCreators as frameac } from '../container/store'
import {actionCreators as borrowac }from '../borrow/store'
import Axios from '../../utils/request'
import Token from '../../utils/token'
import { Tag } from 'antd'
import './style.styl'
import { changeConfirmLocale } from 'antd/lib/modal/locale'
import { ConsoleSqlOutlined } from '@ant-design/icons'
const { RangePicker } = DatePicker
const { Option } = Select
const useStyles = makeStyles((theme) => ({
  root: {
    flex:1,
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 700,
    height: '40px',
    boxShadow: '0px 0px 30px 1px rgba(0,0,0,0.1)',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  cardRoot: {
    width: 180,
    height: 300,
    margin: '10px',
  },
  media: {
    height: 200,
  },
}))

const Search = (props) => {
  const classes = useStyles()
  // const [timeSort, setTimeSort] = useState(0) //0表示不实用，1正序，-1倒序
  // const [AlphaSort, setAlphaSort] = useState(0) 
  const [sort,setSort] = useState([null,null])
  const [bookData, setBookData] = useState([[]])
  const [perpage, setPerpage] = useState(18)
  const [pageIndex, setPageIndex] = useState(1)
  const [perrow, setPerrow] = useState(5)
  const [bottomDistance, setBottomDistance] = useState(1000)
  const [finishLoad, setFinishLoad] = useState(false)
  const [screen, setScreen] = useState({
    bookTypes: [],
    authors: [],
    publishers: [],
    libraries: [],
  }) //筛选
  const history = useHistory()
  const [bookType, setBookType] = useState('') //设置书本的类型
  const [date, setDate] = useState([]) //设置时间区间
  const [author, setAuthor] = useState('')
  const [key, setKey] = useState('') //设置关键字
  const [publisher, setPublisher] = useState('')
  const [library, setLibrary] = useState('')
  const [bookState, setBookState] = useState('') //存储选中的书籍的状态
  const [layers, setLayers] = useState([]) //表示可以选择的层范围
  const [layer, setLayer] = useState('') //表示选中的层
  const [origin, setOrigin] = useState('') //东西南北四个字符
  const [ISBN, setISBN] = useState('') //ISBN码
  const [ISBNError, setISBNError] = useState(false)
  const [showPannel, setShowPannel] = useState(-1)
  const [borrowingBooks,setBorrowingBooks] = useState([])
  const [functionButtonStyle,setFunctionButtonStyle] = useState(0)
   const [pannelData, setPannelData] = useState({
    author: '',
    cover: '',
    entry_time: '',
    id: '',
    name: '',
    place: '',
    price: 0.0,
    publisher: '',
    state: 0,
    summary: '',
    borrowed:0,
    title: '',
    version: '', //书本第几版
  })
  let {login} = props //登陆的标志符

  //获取book的数据，直接返回
  const getBookData = (params) => {
    return Axios.post('/api/book/searchBooks', params).then((res) => {
      if (res.result === 1) {
        let newBookData = res.data.concat([])
        return Promise.resolve({ bookData: newBookData, isLast: res.isLast })
      } else {
        //说明没有书
        return Promise.resolve({ bookData: [], isLast: true })
      }
    })
  }

  //如果login状态发生变化，就要重新查看是否有进入usercenter的权限
  useEffect(()=>{
    console.log(login)
    if(login || Token.validate()){
      console.log('验证通过')
    }else{
      setBorrowingBooks([])
      setFunctionButtonStyle(-3)
    }
  },[login])

  //生成搜索功能要上传的数据
  const comeData = useCallback(() => {
    let data = {
      perpage,
      pageIndex: pageIndex, 
    }
    if (key !== '') {
      data.key = key
    }
    if (publisher !== '') data.publisher = publisher
    if (sort[0] !== null){
      if (sort[0]) data.dateSort = 1
      else if(!sort[0])  data.dateSort = 0
    }
    if (sort[1] !== null){
      if (sort[1]) data.nameSort = 1
      else if(!sort[1])  data.nameSort = 0
    }
    if (date !== []) {
      data.startDate = date[0]
      data.endDate = date[1]
    }
    if (author !== "")
      data.author = author
    if (publisher !== "")
      data.publisher = publisher
    if (ISBN !== '') data.ISBN = ISBN
    switch (bookState) {
      case '可以借阅':
        data.state = 1
        break
      case '无剩余可借':
        data.state = 0
        break
      default:
        break
    }
    if (bookType !== '') data.type = bookType
    if (library !== '') data.library = library
    if (layer !== '') data.layer = layer
    if (origin !== '') data.origin = origin
    return data
  },[pageIndex,publisher,key,sort,date,author,ISBN,bookState,bookType,library,layer,origin])

  
  //第一次加载时获取所有的品类数据，不带上任何搜索，获取所有的类别数据
  useEffect(() => {
    Axios.post('/api/book/getSearchTypes', {}).then((res) => {
      if (res.result === 1) {
        setScreen(res.data)
      }
    })
  }, [])

  //获取用户数据和借书的情况
  const  getInitUserData = ()=>{
    Axios.post('/api/user/getUserData', {}).then((res) => {
      if (res.result === 1) {
        props.modifyUserInfo({
          id: res.data.id,
          card: res.data.card,
          name: res.data.name,
          cover: res.data.cover,
          identity: res.data.identity,
          hasBorrowed: res.data.hasBorrowed,
          isBorrowing: res.data.isBorrowing,
        })
      } else {
        props.modifyShowAlert(true, '获取您的信息失败', 'error')
      }
    })
    Axios.post('/api/user/getUserIsBorrowingBook', {}).then((res) => {
      if (res.result === 1) {
        setBorrowingBooks(res.data)
      } else {
        props.modifyShowAlert(true, '获取您的信息失败', 'error')
      }
    })
  }

  //验证是否登录
  useEffect(() => {
    console.log(props.login)
    //如果内存里登录成功或本地token依然有效，那么数据也肯定加载进来了
    if (props.login || Token.validate()) {
      // props.modifyLogin(true)
      getInitUserData()
    }else{
      console.log('第三方登录验证')
      //没有登陆成功，查看是否是通过第三方登陆进来的
      if (props.location.search !== '') {
        //说明是由第三方登录进来的，这个链接只有可能是通过第三方登录进来的
        let token_array = props.location.search
          .split('?')[1]
          .split('&')[0]
          .split('=')
        console.log(token_array)
        //如果有token这个字段，说明第三方登陆
        if (token_array[0] === 'token') {
          //本地设置token
          Token.set(token_array[1])
          //然后就可以获取数据了
          getInitUserData(token_array[1])
        }
      }else{
        
      }
    }
  }, [])


  //使用
  const loadMore = () => {
    let data = comeData() //生成data
    data.pageIndex += 1
    getBookData(data).then((res) => {
      let newBookData = res.bookData.concat([])
      console.log(res.bookData)
      let myBookData = bookData.concat([[]])
      console.log(myBookData)
      myBookData.pop()
      if (
        myBookData !== [] &&
        myBookData.length > 0 &&
        myBookData != [[]] &&
        myBookData[myBookData.length - 1].length < perrow
      ) {
        console.log(myBookData) //所有本地的数据
        let num = perrow - myBookData[myBookData.length - 1].length
        for (var i = 0; i < num; ++i) {
          if (newBookData.length > 0) {
            myBookData[myBookData.length - 1].push(newBookData.shift())
          }
        }
      }
      while (newBookData.length > 0) {
        myBookData.push(newBookData.splice(0, perrow))
      }
      setBookData(myBookData)
      setFinishLoad(res.isLast)
      setPageIndex(pageIndex + 1)
    })
  }

  //修改当前所在的图书馆
  const handleChangeLibrary = (value) => {
    console.log(value)
    setLibrary(value)
    screen.libraries.map((item, index) => {
      if (item.name === value) {
        setLayers(item.layers)
      }
    })
  }

  //校验ISBN
  const validateISBN = (e) => {
    if (
      /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(e.target.value) ||
      e.target.value === ''
    ) {
      setISBNError(false)
      setISBN(e.target.val)
    } else {
      setISBNError(true)
    }
  }

  //展示pannel
  const showSummary = (index, id) => {
    Axios.post('/api/book/searchBookData', {
      bookId: id,
    }).then((res) => {
      if (res.result === 1) {
        setPannelData(res.data)
        initFunctionButton(res.data,props.bookData,props.identity)
      }
    })
    setShowPannel(index)
  }
  
  //隐藏pannel
  const hideSummary = () => {
    setShowPannel(-1)
  }

  //设置时间
  const handleChangeDate = (date) => {
    setDate([date[0].format('YYYYMMDD'), date[1].format('YYYYMMDD')])
  }

  const search = () => {
    hideSummary()
    let postData = comeData()
    postData.pageIndex = 1
    getBookData(postData).then((res) => {
      let newBookData = res.bookData.concat()
      console.log(newBookData)
      let myBookData = []
      while (newBookData.length > 0) {
        myBookData.push(newBookData.splice(0, perrow))
      }
      setBookData(myBookData)
      setFinishLoad(res.isLast)
      setPageIndex(1)
    })
  }

  //当选项北修改时，自动获取书籍并更新列表
  useEffect(() => {
    search()
  }, [
    date,
    author,
    publisher,
    bookType,
    bookState,
    library,
    layer,
    origin,
    ISBN,
    sort
  ])

  const searchButtonClick = () => {
    search()
  }

  //初始化按钮的功能
  const initFunctionButton = useCallback((pannelData,bookData,identity)=>{
    const identityBookLimit = (identity)=>{
      let limit = 0
      switch(identity){
          case '学生':
            limit = 15
            break
          case '教师':
            limit = 30
            break
          default:
            limit = 0
      }
      return limit
    } 
    //是否已经借阅了
    let isBorrowed = false
    borrowingBooks.map((item,index)=>{
      if(item.id === pannelData.id)
          isBorrowed = true
    })
    //是否在书单中
    let isTryBorrowing = false
    bookData.map((item,index)=>{
       if(item === pannelData.id)
          isTryBorrowing = true
    })
    if(login || Token.validate()){
      //这个用户已经借阅了，不能直接取消
       if(isBorrowed){
         setFunctionButtonStyle(-2)
       } 
      //否则如果该用户已经将这本书放在了预借书单中，我们可以取消
       else if(isTryBorrowing){
         setFunctionButtonStyle(0)
      }
      //已经达到借书上限了
      else if((props.isBorrowing + bookData.size) >= identityBookLimit(identity)){
         setFunctionButtonStyle(-1)
      }
      //这本书并没有在预借书单中，该用户可以借阅
      else{
        setFunctionButtonStyle(1)
      }
    } 
    //否则用户根本没有登陆，我们要求该用户首先给我登陆
    else {
      setFunctionButtonStyle(-3)
    }
  },[borrowingBooks])
   
  //借书事件
  const borrowBook = (id) =>{
    props.modifyBookData(props.bookData.concat([id]))
    setFunctionButtonStyle(0)
  }

  //取消借书事件
  const cancelBorrowBook = id =>{
    let newBookData = []
    props.bookData.map((item,index)=>{
      if(item !== id)
      newBookData.push(item)
    })
    props.modifyBookData(newBookData)
     setFunctionButtonStyle(1)
  }


  return (
    <div className="searchPage">
      <div className="searchBody">
        <div className="searchbar">
          {/* <span className="setting">
            <SettingsIcon />
          </span> */}
          <Paper component="form" className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="搜索书籍的名字、出版社、作者"
              inputProps={{ 'aria-label': '搜索书籍的名字、出版社、作者' }}
              onChange={(e) => setKey(e.target.value)}
            />
            <IconButton
              onClick={searchButtonClick}
              type="submit"
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Paper>
          <div className="sortButtonGroup">
            <Button onClick={() => setSort([!sort[0],null])}>
              { sort[0] !== null ?  '按入馆时间排序': '不按入馆时间排序'}
              { sort[0] !== null ? ( sort[0]? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />):null}
            </Button>
            <Button onClick={() => setSort([null,!sort[1]])}>
            { sort[1] !== null ?  '按首字母排序': '不按首字母排序'}
            { sort[1] !== null ? ( sort[1]? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />):null}
            </Button>
          </div>
        </div>
        <div className="searchResult">
          {bookData.map((item, index) => {
            return (
              <div className="searchLine" key={index}>
                {item.map((item2, index2) => {
                  return (
                    <Card className={classes.cardRoot} key={item2.id}>
                      <CardActionArea
                        onClick={() => showSummary(index, item2.id)}
                      >
                        <CardMedia
                          className={classes.media}
                          image={item2.cover}
                          title="cover"
                        />
                        <CardContent>
                          <Typography
                            gutterBottom
                            variant="body1"
                            component="h2"
                            className="bookname"
                          >
                            {item2.name}
                          </Typography>
                          <Typography
                            gutterBottom
                            variant="body2"
                            component="h6"
                            className="bookauthor"
                          >
                             {item2.author} | 所作
                          </Typography>
                          <Typography
                            gutterBottom
                            variant="body2"
                            component="h6"
                            className="bookpublisher"
                          >
                            {item2.publisher} | 出版
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  )
                })}
                {showPannel === index ? (
                  <div className="searchSummary">
                    <div className="closeButton" onClick={() => hideSummary()}>
                      <CloseIcon />
                    </div>
                    <div className="searchMainData">
                      <div className="searchBookName">{pannelData.name}</div>
                      <div className="searchBookItem">
                        <span className="searchBookBefore">作者</span> |{' '}
                        {pannelData.author}
                      </div>
                      <div className="searchBookItem">
                        <span className="searchBookBefore">出版社</span> |{' '}
                        {pannelData.publisher}
                      </div>
                      <div className="searchBookItem">
                        <span className="searchBookBefore">已借阅次数</span> |{' '}
                        {pannelData.borrowed || 0}
                      </div>
                      <div className="searchBookItem">
                        <span className="searchBookBefore">书籍位置</span> |{' '}
                        {pannelData.place}
                      </div>
                      <div className="searchBookItem">
                        <span className="searchBookBefore">剩余可借</span> |{' '}
                        {pannelData.state}
                      </div>
                    </div>
                    <div className="searchBookSummary">
                      {pannelData.summary}
                    </div>
                    <div className="searchBookMore">
                      <img src={pannelData.cover} className="searchBookImg" />
                      { 
                        //0代表取消加入
                        functionButtonStyle === 0 ? 
                        (
                          <Button
                          color="secondary"
                          onClick={()=>cancelBorrowBook(pannelData.id)}>
                          不加入预借书单
                        </Button>
                        ):null
                       }
                       { 
                        //-2代表已经加入
                        functionButtonStyle === -2? 
                        (
                          <Button disabled>
                          已借阅
                         </Button>
                        ):null
                       }
                       {
                         //-1代表已经达到上限
                        functionButtonStyle === -1 ? 
                        (
                          <Button disabled>
                            您可以借阅的书籍已达上限
                          </Button>
                        ):null
                       }
                       {
                        //-3代表需要登陆
                       functionButtonStyle === -3 ? 
                       (
                        <Button
                          className="positiveButton"
                          variant="outlined"
                          onClick={()=>history.push('/login')}
                          color="primary"
                        >
                          先登录方能借阅
                        </Button>
                       ):null
                      }
                      {
                        //1代表可以借阅
                        functionButtonStyle === 1?
                        (
                          <Button
                            className="positiveButton"
                            variant="outlined"
                            color="primary"
                            onClick={()=>borrowBook(pannelData.id)}>
                            加入预借书单
                         </Button>
                        ):null
                      }
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
          <div className="loadMoreButtonLine">
            <Button
              color="primary"
              className="loadMoreButton"
              onClick={loadMore}
            >
              <ArrowDropDownCircleIcon className="loadMoreIcon" />
              加载更多
            </Button>
          </div>
        </div>
      </div>
      <Affix offsetTop={72}>
      <div className="searchClassify">
        <div className="title">筛选</div>
        <div className="select">
          <div className="select-title">类别</div>
          <Select
            defaultValue="请选择类别"
            style={{ width: 120 }}
            onChange={(value) => setBookType(value)}
          >
           <Option value={""}>
              全部
           </Option>
            {screen.bookTypes.map((item, index) => (
              <Option value={item} key={index}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
        <div className="select date">
          <div className="select-title">入库日期区间</div>
          <RangePicker inputReadOnly onChange={handleChangeDate} />
        </div>
        <div className="select">
          <div className="select-title">书籍状态</div>
          <Select
            defaultValue="请选择书籍状态"
            style={{ width: 120 }}
            onChange={(value) => setBookState(value)}
          >
            <Option value={''}>全部</Option>
            {['可以借阅', '无剩余可借'].map((item, index) => (
              <Option value={item} key={index}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
        <div className="select">
          <div className="select-title">出版社</div>
          <Select
            defaultValue="请选择出版社"
            style={{ width: 'fit-content' }}
            onChange={(value) => setPublisher(value)}
          >
            <Option value={''}>全部</Option>
            {screen.publishers.map((item, index) => (
              <Option value={item} key={index}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
        <div className="select">
          <div className="select-title">作者</div>
          <Select
            defaultValue="请选择作者"
            style={{ width: 'fit-content' }}
            onChange={(value) => setAuthor(value)}
          >
            <Option value={''}>全部</Option>
            {screen.authors.map((item, index) => (
              <Option value={item} key={index}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
        <div className="select">
          <div className="select-title">图书馆馆址</div>
          <Select
            defaultValue="请选择图书馆"
            style={{ width: 'fit-content' }}
            onChange={(value) => handleChangeLibrary(value)}
          >
            <Option value={''}>全部</Option>
            {screen.libraries.map((item, index) => {
              if (
                typeof item.name !== 'undefined' ||
                item.name !== '' ||
                item.name !== null
              ) {
                return (
                  <Option value={item.name} key={index}>
                    {item.name}
                  </Option>
                )
              } else return null
            })}
          </Select>
        </div>
        <div className="select">
          <div className="select-title">图书馆馆层</div>
          <Select
            defaultValue="请选择图书馆层"
            style={{ width: 'fit-content' }}
            onChange={(value) => setLayer(value)}
          >
            <Option value={''}>全部</Option>
            {layers.map((item, index) => {
              return (
                <Option value={item} key={index}>
                  {item}
                </Option>
              )
            })}
          </Select>
        </div>
        <div className="select">
          <div className="select-title">图书馆馆区</div>
          <Select
            defaultValue="请选择图书馆管区"
            style={{ width: 'fit-content' }}
            onChange={(value) => setOrigin(value)}
          >
            <Option value={''}>全部</Option>
            {['东', '西', '南', '北'].map((item, index) => {
              return (
                <Option value={item} key={index}>
                  {item}
                </Option>
              )
            })}
          </Select>
        </div>
        <div className="select">
          <div className="select-title">ISBN</div>
          <Input placeholder="输入ISBN" onChange={(e) => validateISBN(e)} />
          <div className="error">{ISBNError ? 'ISBN码格式错误' : ''}</div>
        </div>
      </div>
      </Affix>
      <BackTop>
         <div className="back-top-button"><ArrowUpwardIcon/></div>
       </BackTop>
      </div>
  )
}

const mapState = state => ({
  login: state.frame.get('login'),
  bookData:state.borrow.get('bookData'),//要借阅的书籍
  name: state.frame.get('name'),
  card: state.frame.get('card'),
  cover: state.frame.get('cover'),
  hasBorrowed: state.frame.get('hasBorrowed'),
  isBorrowing: state.frame.get('isBorrowing'),
  step: state.borrow.get('step'),
  identity: state.frame.get('identity'),})

const mapDispatch = (dispatch) => ({
  modifyLogin(state) {
    dispatch(frameac.modifyLogin(state))
  },
  modifyUserInfo(info) {
    dispatch(frameac.modifyUserInfo(info))
  },
  modifyShowAlert (show, message, type) {
    dispatch(frameac.modifyShowAlert(show,message,type))
  },
  modifyBookData (newBookData) {
    dispatch(borrowac.commitBorrowedBooks(newBookData))
  }
})

export default connect(mapState, mapDispatch)(Search)
