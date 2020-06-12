import React,{lazy}from 'react'
import { Route, HashRouter ,Switch,Redirect} from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
import Axios from 'axios'
import loadable from './utils/loadable'
  
// const Login = loadable(() => import('./pages/login'))
// const Register = loadable(()=>import('./pages/register'))
// const Container = loadable(()=>import('./pages/container'))
// const PasswordConf =  loadable(()=>import('./pages/passwordConf'))
const Login = lazy(() => import('./pages/login'))
const Register = lazy(()=>import('./pages/register'))
const Container = lazy(()=>import('./pages/container'))
const PasswordConf =  lazy(()=>import('./pages/passwordConf'))

const App = () => {
  return (
    <HashRouter>
      <Provider store={store}>
      <React.Suspense fallback={<div>Loading...</div>}>
         <Switch>
        {/* 登陆页面 */}
        <Route path="/login" component={Login}/>
        {/* 注册界面 */}
        <Route path="/register"  component={Register}/>
        {/* 首页路由 */}
        <Route path="/index"   component={Container}/>
        {/* 忘记密码路由 */}
        <Route path="/forgotPassword"  component={PasswordConf}/>
        {/* 默认路由 */}
        <Redirect exact from="/" to="/index/search"/>
       </Switch>
       </React.Suspense>
      </Provider>
    </HashRouter>
  )
}

export default App
