import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { HashRouter, Route, Redirect } from 'react-router-dom'
import { Switch, Inde } from 'react-router'
import store from './store'
import Login from './pages/login'
import Container from './pages/container/Container'
import Register from './pages/register'
import Borrow from './pages/borrow'
import ReadRFID from './components/readrfid'
import CheckBook from './components/checkBook'
class fragment extends PureComponent {
  render() {
    return <div className="main"></div>
  }
}

class App extends PureComponent {
  render() {
    return (
      <HashRouter>
        {/* <Switch> */}
        <Provider store={store}>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/index" component={Container} />
        </Provider>
        {/* </Switch> */}
      </HashRouter>
    )
  }
}

export default App
