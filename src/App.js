import React from 'react'
import { Route, BrowserRouter, HashRouter } from 'react-router-dom'
import store from './store'
import Login from './pages/login'
import Register from './pages/register'
import { StoreContext } from 'redux-react-hook'
const App = () => {
  return (
    <HashRouter>
      <StoreContext.Provider value={store}>
        {/* 登陆页面 */}
        <Route path="/login" component={Login} />
        {/* 注册界面 */}
        <Route path="/register" component={Register} />
      </StoreContext.Provider>
    </HashRouter>
  )
}

export default App
