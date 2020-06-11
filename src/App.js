/*
 * @Author: Daniel
 * @LastEditTime: 2020-05-31 19:44:09
 * @FilePath: /webmaster-front/src/App.js
 */ 
import React from 'react'
import { Route, BrowserRouter, HashRouter ,Switch,Redirect} from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
// import Login from './pages/login'
// import Register from './pages/register'
// import Container from './pages/container'
// import PasswordConf from './pages/passwordConf'
import Axios from 'axios'
import loadable from './utils/loadable'

const Login = loadable(()=>import('./pages/login'))
const Register = loadable(()=>import('./pages/register'))
const Container = loadable(()=>import('./pages/container'))
const PasswordConf =  loadable(()=>import('./pages/passwordConf'))

const App = () => {
  return (
    <HashRouter>
      <Provider store={store}>
         <Switch>
        {/* 登陆页面 */}
        <Route path="/login"  component={Login}/>
        {/* 注册界面 */}
        <Route path="/register"   component={Register}/>
        {/* 首页路由 */}
        <Route path="/index"   component={Container}/>
        {/* 忘记密码路由 */}
        <Route path="/forgotPassword"  component={PasswordConf}/>
        {/* 默认路由 */}
        <Redirect exact from="/" to="/index/search"/>
       </Switch>
      </Provider>
    </HashRouter>
  )
}

export default App
