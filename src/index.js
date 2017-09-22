import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react'
import { render } from 'react-dom'
import './index.css'

import store from './store';

import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './components/App'
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Settings from './components/Settings';
import Users from './components/users/Users';
import User from './components/users/User';
import AddUser from './components/AddUser';

ReactDOM.render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="login" component={Login} />
        <Route path="register" component={Register} />
        <Route path="settings" component={Settings} />
        <Route path="users" component={Users} />
        <Route path="users/add" component={AddUser} />
        <Route path="users/:id" component={User} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'));