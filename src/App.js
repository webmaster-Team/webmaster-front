import React from 'react'
import { Route, HashRouter ,Switch,Redirect} from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
import Axios from 'axios'
import loadable from './utils/loadable'
const App = () => {

  const Login = loadable(() => import('./pages/login'))
  const Register = loadable(()=>import('./pages/register'))
  const Container = loadable(()=>import('./pages/container'))
  const PasswordConf =  loadable(()=>import('./pages/passwordConf'))

  return (
    <HashRouter>
      <Provider store={store}>
         <Switch>
        {/* 登陆页面 */}
        <Route path="/auth/login" component={Login}/>
        {/* 注册界面 */}
        <Route path="/auth/register"  component={Register}/>
        {/* 首页路由 */}
        <Route path="/index"   component={Container}/>
        {/* 忘记密码路由 */}
        <Route path="/auth/forgotPassword"  component={PasswordConf}/>
        {/* 默认路由 */}
        <Redirect exact from="/" to="/index/search"/>
       </Switch>
      </Provider>
    </HashRouter>
  )
}

export default App
