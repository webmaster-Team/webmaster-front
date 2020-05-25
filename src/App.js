import React from 'react'
import { Route, BrowserRouter, HashRouter ,Switch} from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
import Login from './pages/login'
import Register from './pages/register'
import Container from './pages/container'
import axios from 'axios'

//生产环境中出现头部丢失的情况，强制全局设置头部的url
axios.defaults.baseURL = 'http://123.56.3.135:8080'

const App = () => {
  return (
    <HashRouter>
      <Provider store={store}>
         <Switch>
        {/* 登陆页面 */}
        <Route path="/login" component={Login} />
        {/* 注册界面 */}
        <Route path="/register" component={Register} />
        {/* 首页路由 */}
        <Route path="/index" component={Container} />
       </Switch>
      </Provider>
    </HashRouter>
  )
}

export default App
