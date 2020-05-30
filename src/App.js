import React from 'react'
import { Route, BrowserRouter, HashRouter ,Switch,Redirect} from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
import Login from './pages/login'
import Register from './pages/register'
import Container from './pages/container'
import Axios from 'axios'

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
        {/* 默认路由 */}
        <Redirect exact from="/" to="/index/search"/>
       </Switch>
      </Provider>
    </HashRouter>
  )
}

export default App
