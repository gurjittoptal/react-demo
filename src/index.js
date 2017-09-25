import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react'
import { render } from 'react-dom'
import './index.css'

import store from './store';

import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './components/App'
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Settings from './components/auth/Settings';
import Users from './components/users/Users';
import User from './components/users/User';
import AddUser from './components/users/AddUser';
import Repairs from './components/repairs/Repairs';
import AddRepair from './components/repairs/AddRepair';
import EditRepair from './components/repairs/EditRepair';
import Repair from './components/repairs/Repair';

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
        <Route path="repairs" component={Repairs} />
        <Route path="repairs/add" component={AddRepair} />
        <Route path="repairs/:id" component={Repair} />
        <Route path="repairs/edit/:id" component={EditRepair} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'));