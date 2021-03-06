import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { GlobalStyle } from './style'
import App from './App'
import { IconGlobalStyle } from './statics/iconfont/iconfont'
import 'antd/dist/antd.css';

const AppWithStyle = (
  <Fragment>
    <IconGlobalStyle />
    <GlobalStyle />
    <App />
  </Fragment>
)

ReactDOM.render(AppWithStyle, document.getElementById('root'))
