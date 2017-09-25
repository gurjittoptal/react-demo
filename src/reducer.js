import auth from './reducers/auth';
import adduser from './reducers/adduser';
import addrepair from './reducers/addrepair';
import editrepair from './reducers/editrepair';
import { combineReducers } from 'redux';
import home from './reducers/home';
import common from './reducers/common';
import repair from './reducers/repair';
import repairs from './reducers/repairs';
import user from './reducers/user';
import users from './reducers/users';
import settings from './reducers/settings';

export default combineReducers({
  auth,
  adduser,
  addrepair,
  editrepair,
  common,
  home,
  repair,
  repairs,
  user,
  users,
  settings
});
