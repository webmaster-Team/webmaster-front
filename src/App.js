import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom'
import { Switch } from 'react-router'
import store from './store'
import Login from './pages/login'
import Container from './pages/container/Container'
import Register from './pages/register'
class App extends PureComponent {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Provider store={store}>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/" exact component={Container} />
            {/* <Route path='/detail&id=:id' exact render={() => { return (<div><SelfHeader /><Blank /><Detail /></div>) }}></Route> --> */}
            {/* <Route path='/write' exact render={()=>{return (<div><Write/></div>)}}></Route> */}
          </Provider>
        </Switch>
      </HashRouter>
    )
  }
}

export default App
