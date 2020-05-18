import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { Route, BrowserRouter,Redirect } from 'react-router-dom'
import { Switch } from 'react-router'
import store from './store'
import Login from './pages/login'
import Container from './pages/container/Container'
import Register from './pages/register'

class App extends PureComponent {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          {/* <Redirect from='/' to="/index/borrow/readrfid"/> */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/index" component={Container} />
        </Provider>
      </BrowserRouter>
    )
  }
}

export default App
