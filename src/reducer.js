import auth from './reducers/auth';
import { combineReducers } from 'redux';
import home from './reducers/home';
import common from './reducers/common';
import users from './reducers/users';
import settings from './reducers/settings';

export default combineReducers({
  auth,
  common,
  home,
  users,
  settings
});
