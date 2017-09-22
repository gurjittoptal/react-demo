import auth from './reducers/auth';
import adduser from './reducers/adduser';
import { combineReducers } from 'redux';
import home from './reducers/home';
import common from './reducers/common';
import user from './reducers/user';
import users from './reducers/users';
import settings from './reducers/settings';

export default combineReducers({
  auth,
  adduser,
  common,
  home,
  user,
  users,
  settings
});
