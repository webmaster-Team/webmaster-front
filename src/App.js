import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom'
import store from './store'
import Login from './pages/login'

class App extends PureComponent {
  render() {
    return (
      <HashRouter>
        <Provider store={store}>
          <Route path="/login" exact component={Login}></Route>
          {/* <Route path='/detail&id=:id' exact render={() => { return (<div><Header /><Blank /><Detail /></div>) }}></Route> --> */}
          {/* <Route path='/write' exact render={()=>{return (<div><Write/></div>)}}></Route> */}
        </Provider>
      </HashRouter>
    )
  }
}

export default App
